using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.DeleteGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogById;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogsByBabyId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class GrowthLogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<GrowthLogDto>>> GetByBabyIdAsync(
        [FromQuery] string babyId,
        [FromQuery] string? cursorSk = null,
        [FromQuery] int limit = 20)
    {
        var result = await sender.Send(new GetGrowthLogsByBabyIdQuery(babyId, cursorSk, limit));
        return Ok(result.Value);
    }

    [HttpGet("item")]
    public async Task<ActionResult<GrowthLogDto>> GetByKeyAsync([FromQuery] string babyId, [FromQuery] string sk)
    {
        var result = await sender.Send(new GetGrowthLogByIdQuery(babyId, sk));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    [HttpPost]
    public async Task<ActionResult<GrowthLogDto>> CreateAsync([FromBody] CreateGrowthLogDto request)
    {
        var result = await sender.Send(new CreateGrowthLogCommand(request));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpPut("item")]
    public async Task<ActionResult<GrowthLogDto>> UpdateAsync([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateGrowthLogDto request)
    {
        var result = await sender.Send(new UpdateGrowthLogCommand(babyId, sk, request));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpDelete("item")]
    public async Task<ActionResult> DeleteAsync([FromQuery] string babyId, [FromQuery] string sk)
    {
        var result = await sender.Send(new DeleteGrowthLogCommand(babyId, sk));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
