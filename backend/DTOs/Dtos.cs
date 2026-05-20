namespace TaskFlow.API.DTOs;

// ── Auth 
public record RegisterDto(string Email, string Password, string Role = "Member");
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, UserDto User);

// ── User 
public record UserDto(int Id, string Email, string Role);

// ── Project
public record CreateProjectDto(string Name, string? Description);
public record UpdateProjectDto(string Name, string? Description);

public record ProjectDto(
    int Id,
    string Name,
    string? Description,
    DateTime CreatedAt,
    UserDto Owner,
    int MemberCount,
    int TaskCount
);

// ── Project Member
public record AddMemberDto(string Email, string Role = "Member");
public record MemberDto(int Id, UserDto User, string Role, DateTime JoinedAt);

// ── Task 
public record CreateTaskDto(
    string Title,
    string? Description,
    string Status,
    string Priority,
    DateTime? DueDate,
    int? AssignedToId
);

public record UpdateTaskDto(
    string? Title,
    string? Description,
    string? Status,
    string? Priority,
    DateTime? DueDate,
    int? AssignedToId
);

public record TaskDto(
    int Id,
    string Title,
    string? Description,
    string Status,
    string Priority,
    DateTime? DueDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int ProjectId,
    string ProjectName,
    UserDto CreatedBy,
    UserDto? AssignedTo
);

// ── Dashboard
public record DashboardStatsDto(
    int TotalProjects,
    int TotalTasks,
    int PendingTasks,
    int InProgressTasks,
    int CompletedTasks,
    int OverdueTasks,
    IEnumerable<TaskDto> RecentTasks
);
