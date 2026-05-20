using System.ComponentModel.DataAnnotations;

namespace TaskFlow.API.Models;

public class User
{
    public int Id { get; set; }

    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    /// Admin or Member
    [Required, MaxLength(20)]
    public string Role { get; set; } = "Member";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    public ICollection<TaskItem> AssignedTasks { get; set; } = [];
    public ICollection<TaskItem> CreatedTasks { get; set; } = [];
}
