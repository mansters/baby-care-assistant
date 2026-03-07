using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Features.Log.Queries.GetLogs;
using BabyCareAssistant.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class LogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedLogResponse>> GetLogsAsync(
        [FromQuery] string babyId,
        [FromQuery] string? cursor,
        [FromQuery] int pageSize = 20,
        [FromQuery] LogType[]? types = null)
    {
        var result = await sender.Send(new GetLogsQuery(babyId, cursor, pageSize, types));
        return Ok(result.Value);
    }
}
