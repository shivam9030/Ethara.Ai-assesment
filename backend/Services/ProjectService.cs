using Microsoft.EntityFrameworkCore;
using TaskFlow.API.Data;
using TaskFlow.API.DTOs;
using TaskFlow.API.Models;

namespace TaskFlow.API.Services;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync(int userId, string userRole);
    Task<ProjectDto> GetByIdAsync(int id, int userId, string userRole);
    Task<ProjectDto> CreateAsync(CreateProjectDto dto, int ownerId);
    Task<ProjectDto> UpdateAsync(int id, UpdateProjectDto dto, int userId, string userRole);
    Task DeleteAsync(int id, int userId, string userRole);
    Task<IEnumerable<MemberDto>> GetMembersAsync(int projectId, int userId, string userRole);
    Task<MemberDto> AddMemberAsync(int projectId, AddMemberDto dto, int requesterId, string requesterRole);
    Task RemoveMemberAsync(int projectId, int memberId, int requesterId, string requesterRole);
}

public class ProjectService(AppDbContext db) : IProjectService
{
    //  Helpers 
    private static ProjectDto ToDto(Project p) => new(
        p.Id, p.Name, p.Description, p.CreatedAt,
        new UserDto(p.Owner.Id, p.Owner.Email, p.Owner.Role),
        p.Members.Count,
        p.Tasks.Count);

    private static MemberDto ToMemberDto(ProjectMember pm) => new(
        pm.Id,
        new UserDto(pm.User.Id, pm.User.Email, pm.User.Role),
        pm.Role,
        pm.JoinedAt);

    private async Task<Project> GetProjectOrThrowAsync(int id) =>
        await db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Members).ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id)
        ?? throw new KeyNotFoundException($"Project {id} not found.");

    private bool CanAccessProject(Project p, int userId, string userRole) =>
        userRole == "Admin" || p.OwnerId == userId ||
        p.Members.Any(m => m.UserId == userId);

    private bool CanManageProject(Project p, int userId, string userRole) =>
        userRole == "Admin" || p.OwnerId == userId ||
        p.Members.Any(m => m.UserId == userId && m.Role == "Admin");

    //  CRUD 
    public async Task<IEnumerable<ProjectDto>> GetAllAsync(int userId, string userRole)
    {
        var query = db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Members).ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .AsQueryable();

        if (userRole != "Admin")
            query = query.Where(p =>
                p.OwnerId == userId ||
                p.Members.Any(m => m.UserId == userId));

        return (await query.ToListAsync()).Select(ToDto);
    }

    public async Task<ProjectDto> GetByIdAsync(int id, int userId, string userRole)
    {
        var p = await GetProjectOrThrowAsync(id);
        if (!CanAccessProject(p, userId, userRole))
            throw new UnauthorizedAccessException("Access denied.");
        return ToDto(p);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto, int ownerId)
    {
        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            OwnerId = ownerId
        };
        db.Projects.Add(project);
        await db.SaveChangesAsync();

        // Auto-add owner as Admin member
        db.ProjectMembers.Add(new ProjectMember
        {
            ProjectId = project.Id,
            UserId = ownerId,
            Role = "Admin"
        });
        await db.SaveChangesAsync();

        return ToDto(await GetProjectOrThrowAsync(project.Id));
    }

    public async Task<ProjectDto> UpdateAsync(int id, UpdateProjectDto dto, int userId, string userRole)
    {
        var p = await GetProjectOrThrowAsync(id);
        if (!CanManageProject(p, userId, userRole))
            throw new UnauthorizedAccessException("Only project admins can update projects.");

        p.Name = dto.Name;
        p.Description = dto.Description;
        await db.SaveChangesAsync();

        return ToDto(await GetProjectOrThrowAsync(id));
    }

    public async Task DeleteAsync(int id, int userId, string userRole)
    {
        var p = await GetProjectOrThrowAsync(id);
        if (userRole != "Admin" && p.OwnerId != userId)
            throw new UnauthorizedAccessException("Only the project owner or a global Admin can delete projects.");

        db.Projects.Remove(p);
        await db.SaveChangesAsync();
    }

    //  Members 
    public async Task<IEnumerable<MemberDto>> GetMembersAsync(int projectId, int userId, string userRole)
    {
        var p = await GetProjectOrThrowAsync(projectId);
        if (!CanAccessProject(p, userId, userRole))
            throw new UnauthorizedAccessException("Access denied.");

        return p.Members.Select(ToMemberDto);
    }

    public async Task<MemberDto> AddMemberAsync(int projectId, AddMemberDto dto, int requesterId, string requesterRole)
    {
        var p = await GetProjectOrThrowAsync(projectId);
        if (!CanManageProject(p, requesterId, requesterRole))
            throw new UnauthorizedAccessException("Only project admins can add members.");

        var targetUser = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower())
            ?? throw new KeyNotFoundException($"User '{dto.Email}' not found.");

        if (p.Members.Any(m => m.UserId == targetUser.Id))
            throw new InvalidOperationException("User is already a member.");

        var role = dto.Role is "Admin" or "Member" ? dto.Role : "Member";
        var member = new ProjectMember
        {
            ProjectId = projectId,
            UserId = targetUser.Id,
            Role = role
        };
        db.ProjectMembers.Add(member);
        await db.SaveChangesAsync();

        await db.Entry(member).Reference(m => m.User).LoadAsync();
        return ToMemberDto(member);
    }

    public async Task RemoveMemberAsync(int projectId, int memberId, int requesterId, string requesterRole)
    {
        var p = await GetProjectOrThrowAsync(projectId);
        if (!CanManageProject(p, requesterId, requesterRole))
            throw new UnauthorizedAccessException("Only project admins can remove members.");

        var member = p.Members.FirstOrDefault(m => m.Id == memberId)
            ?? throw new KeyNotFoundException("Member not found.");

        db.ProjectMembers.Remove(member);
        await db.SaveChangesAsync();
    }
}
