using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.DeleteFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetAllFeedingLogs;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FeedingLogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllFeedingLogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FeedingLogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetFeedingLogByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<FeedingLogDto>> CreateAsync([FromBody] CreateFeedingLogDto request)
    {
        var result = await sender.Send(new CreateFeedingLogCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<FeedingLogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateFeedingLogDto request)
    {
        var result = await sender.Send(new UpdateFeedingLogCommand(id, request));

        if (!result.IsSuccess)
        {
            if (result.Error == "The ID in the URL does not match the ID in the request body.")
            {
                return BadRequest(result.Error);
            }
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await sender.Send(new DeleteFeedingLogCommand(id));
        return NoContent();
    }
}