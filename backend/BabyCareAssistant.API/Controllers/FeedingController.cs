using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.DeleteFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogsByBabyId;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogById;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetDailyFeedingSummary;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetNextFeeding;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FeedingLogDto>>> GetByBabyIdAsync(
        [FromQuery] string babyId, [FromQuery] string? cursorSk, [FromQuery] int limit = 20)
    {
        var result = await sender.Send(new GetFeedingLogsByBabyIdQuery(babyId, cursorSk, limit));
        return Ok(result.Value);
    }

    [HttpGet("item", Name = "GetFeedingLogByIdAsync")]
    public async Task<ActionResult<FeedingLogDto>> GetByKeyAsync([FromQuery] string babyId, [FromQuery] string sk)
    {
        var result = await sender.Send(new GetFeedingLogByIdQuery(babyId, sk));

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
        return CreatedAtRoute("GetFeedingLogByIdAsync", new { babyId = result.Value!.BabyId, sk = result.Value.SK }, result.Value);
    }

    [HttpPut("item")]
    public async Task<ActionResult<FeedingLogDto>> UpdateAsync([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateFeedingLogDto request)
    {
        var result = await sender.Send(new UpdateFeedingLogCommand(babyId, sk, request));

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

    [HttpDelete("item")]
    public async Task<IActionResult> DeleteAsync([FromQuery] string babyId, [FromQuery] string sk)
    {
        await sender.Send(new DeleteFeedingLogCommand(babyId, sk));
        return NoContent();
    }

    [HttpGet("daily-summary")]
    public async Task<ActionResult<DailyFeedingSummaryDto>> GetDailySummaryAsync(
        [FromQuery] string babyId)
    {
        var result = await sender.Send(new GetDailyFeedingSummaryQuery(babyId));
        return Ok(result.Value);
    }

    [HttpGet("next-feeding")]
    public async Task<ActionResult<NextFeedingDto>> GetNextFeedingAsync(
        [FromQuery] string babyId)
    {
        var result = await sender.Send(new GetNextFeedingQuery(babyId));
        return Ok(result.Value);
    }
}