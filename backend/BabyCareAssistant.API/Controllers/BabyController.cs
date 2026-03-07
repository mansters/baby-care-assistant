using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.DeleteBaby;
using BabyCareAssistant.Application.Features.Baby.Queries.GetBabiesByFamilyId;
using BabyCareAssistant.Application.Features.Baby.Queries.GetBabyById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BabyController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BabyDto>>> GetByFamilyIdAsync([FromQuery] string familyId)
    {
        var result = await sender.Send(new GetBabiesByFamilyIdQuery(familyId));
        return Ok(result.Value);
    }

    [HttpGet("item", Name = "GetByIdAsync")]
    public async Task<ActionResult<BabyDto>> GetByIdAsync([FromQuery] string id)
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

    [HttpPut("item")]
    public async Task<ActionResult<BabyDto>> UpdateAsync([FromQuery] string id, [FromBody] UpdateBabyDto request)
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

    [HttpDelete("item")]
    public async Task<IActionResult> DeleteAsync([FromQuery] string id)
    {
        await sender.Send(new DeleteBabyCommand(id));
        return NoContent();
    }
}