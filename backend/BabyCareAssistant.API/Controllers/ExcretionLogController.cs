using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.DeleteExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogsByBabyId;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ExcretionLogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExcretionLogDto>>> GetByBabyIdAsync(
        [FromQuery] string babyId, [FromQuery] string? cursorSk, [FromQuery] int limit = 20)
    {
        var result = await sender.Send(new GetExcretionLogsByBabyIdQuery(babyId, cursorSk, limit));
        return Ok(result.Value);
    }

    [HttpGet("item", Name = "GetExcretionLogByIdAsync")]
    public async Task<ActionResult<ExcretionLogDto>> GetByKeyAsync([FromQuery] string babyId, [FromQuery] string sk)
    {
        var result = await sender.Send(new GetExcretionLogByIdQuery(babyId, sk));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<ExcretionLogDto>> CreateAsync([FromBody] CreateExcretionLogDto request)
    {
        var result = await sender.Send(new CreateExcretionLogCommand(request));
        return CreatedAtRoute("GetExcretionLogByIdAsync", new { babyId = result.Value!.BabyId, sk = result.Value.SK }, result.Value);
    }

    [HttpPut("item")]
    public async Task<ActionResult<ExcretionLogDto>> UpdateAsync([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateExcretionLogDto request)
    {
        var result = await sender.Send(new UpdateExcretionLogCommand(babyId, sk, request));

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
        await sender.Send(new DeleteExcretionLogCommand(babyId, sk));
        return NoContent();
    }
}
