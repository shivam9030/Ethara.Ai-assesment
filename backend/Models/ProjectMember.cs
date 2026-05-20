using System.ComponentModel.DataAnnotations;

namespace TaskFlow.API.Models;

//Join table – links a User to a Project with a role
public class ProjectMember
{
    public int Id { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

   
    [Required, MaxLength(20)]
    public string Role { get; set; } = "Member";

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
