using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.API.DTOs;
using TaskFlow.API.Services;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController(IProjectService projectService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string UserRole => User.FindFirstValue(ClaimTypes.Role)!;

    // GET /api/projects
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var projects = await projectService.GetAllAsync(UserId, UserRole);
        return Ok(projects);
    }

    // GET /api/projects/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var project = await projectService.GetByIdAsync(id, UserId, UserRole);
            return Ok(project);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // POST /api/projects
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        var project = await projectService.CreateAsync(dto, UserId);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    // PUT /api/projects/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
    {
        try
        {
            var project = await projectService.UpdateAsync(id, dto, UserId, UserRole);
            return Ok(project);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // DELETE /api/projects/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await projectService.DeleteAsync(id, UserId, UserRole);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // ── Members

    // GET /api/projects/{id}/members
    [HttpGet("{id:int}/members")]
    public async Task<IActionResult> GetMembers(int id)
    {
        try
        {
            var members = await projectService.GetMembersAsync(id, UserId, UserRole);
            return Ok(members);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // POST /api/projects/{id}/members
    [HttpPost("{id:int}/members")]
    public async Task<IActionResult> AddMember(int id, [FromBody] AddMemberDto dto)
    {
        try
        {
            var member = await projectService.AddMemberAsync(id, dto, UserId, UserRole);
            return CreatedAtAction(nameof(GetMembers), new { id }, member);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    // DELETE /api/projects/{projectId}/members/{memberId}
    [HttpDelete("{projectId:int}/members/{memberId:int}")]
    public async Task<IActionResult> RemoveMember(int projectId, int memberId)
    {
        try
        {
            await projectService.RemoveMemberAsync(projectId, memberId, UserId, UserRole);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }
}
