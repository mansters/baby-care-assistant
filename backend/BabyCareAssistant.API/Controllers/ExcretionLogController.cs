using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.ExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExcretionLogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExcretionLogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllExcretionLogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExcretionLogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetExcretionLogByIdQuery(id));

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
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExcretionLogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateExcretionLogDto request)
    {
        var result = await sender.Send(new UpdateExcretionLogCommand(id, request));

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
        await sender.Send(new DeleteExcretionLogCommand(id));
        return NoContent();
    }
}
