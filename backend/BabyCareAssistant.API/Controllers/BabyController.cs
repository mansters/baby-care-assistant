using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Features.Baby.Commands;
using BabyCareAssistant.Application.Features.Baby.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BabyController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BabyDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllBabiesQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}", Name = "GetByIdAsync")]
    public async Task<ActionResult<BabyDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetBabyByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<BabyDto>> CreateAsync([FromBody] CreateBabyDto request)
    {
        var result = await sender.Send(new CreateBabyCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BabyDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateBabyDto request)
    {
        var result = await sender.Send(new UpdateBabyCommand(id, request));

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
        await sender.Send(new DeleteBabyCommand(id));
        return NoContent();
    }
}