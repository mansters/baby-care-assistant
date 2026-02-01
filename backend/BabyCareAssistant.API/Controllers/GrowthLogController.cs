using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.DeleteGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetAllGrowthLogs;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GrowthLogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GrowthLogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllGrowthLogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GrowthLogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetGrowthLogByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<GrowthLogDto>> CreateAsync([FromBody] CreateGrowthLogDto request)
    {
        var result = await sender.Send(new CreateGrowthLogCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<GrowthLogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateGrowthLogDto request)
    {
        var result = await sender.Send(new UpdateGrowthLogCommand(id, request));

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
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await sender.Send(new DeleteGrowthLogCommand(id));
        return NoContent();
    }
}