using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.API.DTOs;
using TaskFlow.API.Services;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class TasksController(ITaskService taskService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string UserRole => User.FindFirstValue(ClaimTypes.Role)!;

    // GET /api/projects/{projectId}/tasks
    [HttpGet("projects/{projectId:int}/tasks")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        try
        {
            var tasks = await taskService.GetTasksByProjectAsync(projectId, UserId, UserRole);
            return Ok(tasks);
        }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // GET /api/tasks/{id}
    [HttpGet("tasks/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var task = await taskService.GetTaskByIdAsync(id, UserId, UserRole);
            return Ok(task);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // POST /api/projects/{projectId}/tasks
    [HttpPost("projects/{projectId:int}/tasks")]
    public async Task<IActionResult> Create(int projectId, [FromBody] CreateTaskDto dto)
    {
        try
        {
            var task = await taskService.CreateTaskAsync(projectId, dto, UserId, UserRole);
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException ex) { return Forbid(); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    // PUT /api/tasks/{id}
    [HttpPut("tasks/{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        try
        {
            var task = await taskService.UpdateTaskAsync(id, dto, UserId, UserRole);
            return Ok(task);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    // DELETE /api/tasks/{id}
    [HttpDelete("tasks/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await taskService.DeleteTaskAsync(id, UserId, UserRole);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // GET /api/tasks  (convenience — all tasks accessible to caller)
    [HttpGet("tasks")]
    public async Task<IActionResult> GetDashboardTasks()
    {
        var stats = await taskService.GetDashboardStatsAsync(UserId, UserRole);
        return Ok(stats.RecentTasks);
    }

    // GET /api/dashboard
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var stats = await taskService.GetDashboardStatsAsync(UserId, UserRole);
        return Ok(stats);
    }
}
