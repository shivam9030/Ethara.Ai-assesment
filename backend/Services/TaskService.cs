using Microsoft.EntityFrameworkCore;
using TaskFlow.API.Data;
using TaskFlow.API.DTOs;
using TaskFlow.API.Models;

namespace TaskFlow.API.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(int projectId, int userId, string userRole);
    Task<TaskDto> GetTaskByIdAsync(int taskId, int userId, string userRole);
    Task<TaskDto> CreateTaskAsync(int projectId, CreateTaskDto dto, int creatorId, string userRole);
    Task<TaskDto> CreateTaskWithoutProjectAsync(CreateTaskDto dto, int creatorId, string userRole);
    Task<TaskDto> UpdateTaskAsync(int taskId, UpdateTaskDto dto, int userId, string userRole);
    Task DeleteTaskAsync(int taskId, int userId, string userRole);
    Task<IEnumerable<TaskDto>> GetAllTasksAsync(int userId, string userRole);
    Task<DashboardStatsDto> GetDashboardStatsAsync(int userId, string userRole);
}

public class TaskService(AppDbContext db) : ITaskService
{
    private static readonly string[] ValidStatuses = ["Pending", "InProgress", "Completed"];
    private static readonly string[] ValidPriorities = ["Low", "Medium", "High"];

    //  Mapping 
    private static TaskDto ToDto(TaskItem t) => new(
        t.Id, t.Title, t.Description, t.Status, t.Priority,
        t.DueDate, t.CreatedAt, t.UpdatedAt,
        t.ProjectId, t.Project.Name,
        new UserDto(t.CreatedBy.Id, t.CreatedBy.Email, t.CreatedBy.Role),
        t.AssignedTo is null ? null : new UserDto(t.AssignedTo.Id, t.AssignedTo.Email, t.AssignedTo.Role));

    private IQueryable<TaskItem> TasksWithIncludes() =>
        db.Tasks
          .Include(t => t.Project)
          .Include(t => t.CreatedBy)
          .Include(t => t.AssignedTo);

    //  Access helpers 
    private async Task<bool> CanAccessProjectAsync(int projectId, int userId, string userRole)
    {
        if (userRole == "Admin") return true;
        return await db.ProjectMembers.AnyAsync(pm =>
            pm.ProjectId == projectId && pm.UserId == userId);
    }

    private async Task<bool> CanManageProjectAsync(int projectId, int userId, string userRole)
    {
        if (userRole == "Admin") return true;
        return await db.ProjectMembers.AnyAsync(pm =>
            pm.ProjectId == projectId && pm.UserId == userId && pm.Role == "Admin");
    }

    //  Queries 
    public async Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(int projectId, int userId, string userRole)
    {
        if (!await CanAccessProjectAsync(projectId, userId, userRole))
            throw new UnauthorizedAccessException("Access denied.");

        var tasks = await TasksWithIncludes()
            .Where(t => t.ProjectId == projectId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(ToDto);
    }

    public async Task<TaskDto> GetTaskByIdAsync(int taskId, int userId, string userRole)
    {
        var task = await TasksWithIncludes().FirstOrDefaultAsync(t => t.Id == taskId)
            ?? throw new KeyNotFoundException($"Task {taskId} not found.");

        if (!await CanAccessProjectAsync(task.ProjectId, userId, userRole))
            throw new UnauthorizedAccessException("Access denied.");

        return ToDto(task);
    }

    //  Mutations 
    public async Task<TaskDto> CreateTaskAsync(int projectId, CreateTaskDto dto, int creatorId, string userRole)
    {
        if (!await CanAccessProjectAsync(projectId, creatorId, userRole))
            throw new UnauthorizedAccessException("You are not a member of this project.");

        var status = (dto.Status != null && ValidStatuses.Contains(dto.Status)) ? dto.Status : "Pending";
        var priority = (dto.Priority != null && ValidPriorities.Contains(dto.Priority)) ? dto.Priority : "Medium";

        // Validate assignee is a project member
        if (dto.AssignedToId.HasValue)
        {
            var isMember = await db.ProjectMembers.AnyAsync(pm =>
                pm.ProjectId == projectId && pm.UserId == dto.AssignedToId.Value);
            if (!isMember)
                throw new InvalidOperationException("Assigned user is not a member of this project.");
        }

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = status,
            Priority = priority,
            DueDate = dto.DueDate?.ToUniversalTime(),
            ProjectId = projectId,
            CreatedById = creatorId,
            AssignedToId = dto.AssignedToId
        };

        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        return ToDto(await TasksWithIncludes().FirstAsync(t => t.Id == task.Id));
    }

    public async Task<TaskDto> CreateTaskWithoutProjectAsync(CreateTaskDto dto, int creatorId, string userRole)
    {
        // Find the first project this user has access to
        var pm = await db.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.UserId == creatorId);

        int projectId;
        if (pm == null)
        {
            // If the user has no projects, create a default one for them
            var project = new Project
            {
                Name = "General Project",
                Description = "Auto-generated project for quick tasks",
                OwnerId = creatorId
            };
            db.Projects.Add(project);
            await db.SaveChangesAsync();

            var member = new ProjectMember
            {
                ProjectId = project.Id,
                UserId = creatorId,
                Role = "Admin"
            };
            db.ProjectMembers.Add(member);
            await db.SaveChangesAsync();

            projectId = project.Id;
        }
        else
        {
            projectId = pm.ProjectId;
        }

        return await CreateTaskAsync(projectId, dto, creatorId, userRole);
    }

    public async Task<TaskDto> UpdateTaskAsync(int taskId, UpdateTaskDto dto, int userId, string userRole)
    {
        var task = await db.Tasks.FindAsync(taskId)
            ?? throw new KeyNotFoundException($"Task {taskId} not found.");

        bool canManage = await CanManageProjectAsync(task.ProjectId, userId, userRole);
        bool isAssignee = task.AssignedToId == userId;
        bool isCreator = task.CreatedById == userId;

        // Members can only update status of their own tasks; Admins can change anything
        if (!canManage && !isAssignee && !isCreator)
            throw new UnauthorizedAccessException("You don't have permission to update this task.");

        if (dto.Title is not null) task.Title = dto.Title;
        if (dto.Description is not null) task.Description = dto.Description;
        if (dto.Status is not null && ValidStatuses.Contains(dto.Status)) task.Status = dto.Status;

        // Only admins/creators can change priority, due date, assignee
        if (canManage || isCreator)
        {
            if (dto.Priority is not null && ValidPriorities.Contains(dto.Priority)) task.Priority = dto.Priority;
            if (dto.DueDate.HasValue) task.DueDate = dto.DueDate.Value.ToUniversalTime();
            if (dto.AssignedToId.HasValue)
            {
                var isMember = await db.ProjectMembers.AnyAsync(pm =>
                    pm.ProjectId == task.ProjectId && pm.UserId == dto.AssignedToId.Value);
                if (!isMember)
                    throw new InvalidOperationException("Assigned user is not a project member.");
                task.AssignedToId = dto.AssignedToId;
            }
        }

        task.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return ToDto(await TasksWithIncludes().FirstAsync(t => t.Id == task.Id));
    }

    public async Task DeleteTaskAsync(int taskId, int userId, string userRole)
    {
        var task = await db.Tasks.FindAsync(taskId)
            ?? throw new KeyNotFoundException($"Task {taskId} not found.");

        if (!await CanManageProjectAsync(task.ProjectId, userId, userRole) && task.CreatedById != userId)
            throw new UnauthorizedAccessException("Only project admins or the task creator can delete tasks.");

        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
    }

    public async Task<IEnumerable<TaskDto>> GetAllTasksAsync(int userId, string userRole)
    {
        var projectIds = userRole == "Admin"
            ? await db.Projects.Select(p => p.Id).ToListAsync()
            : await db.ProjectMembers
                .Where(pm => pm.UserId == userId)
                .Select(pm => pm.ProjectId)
                .ToListAsync();

        var tasks = await TasksWithIncludes()
            .Where(t => projectIds.Contains(t.ProjectId))
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(ToDto);
    }

    //  Dashboard ─
    public async Task<DashboardStatsDto> GetDashboardStatsAsync(int userId, string userRole)
    {
        var projectIds = userRole == "Admin"
            ? await db.Projects.Select(p => p.Id).ToListAsync()
            : await db.ProjectMembers
                .Where(pm => pm.UserId == userId)
                .Select(pm => pm.ProjectId)
                .ToListAsync();

        var tasks = await TasksWithIncludes()
            .Where(t => projectIds.Contains(t.ProjectId))
            .ToListAsync();

        var now = DateTime.UtcNow;
        var overdue = tasks.Count(t =>
            t.Status != "Completed" && t.DueDate.HasValue && t.DueDate.Value < now);

        var recent = tasks
            .OrderByDescending(t => t.UpdatedAt)
            .Take(5)
            .Select(ToDto);

        return new DashboardStatsDto(
            TotalProjects: projectIds.Count,
            TotalTasks: tasks.Count,
            PendingTasks: tasks.Count(t => t.Status == "Pending"),
            InProgressTasks: tasks.Count(t => t.Status == "InProgress"),
            CompletedTasks: tasks.Count(t => t.Status == "Completed"),
            OverdueTasks: overdue,
            RecentTasks: recent);
    }
}
