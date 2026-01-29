using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccinationRecord;
using BabyCareAssistant.Application.Features.VaccinationRecord.Commands;
using BabyCareAssistant.Application.Features.VaccinationRecord.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccinationRecordController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaccinationRecordDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllVaccinationRecordsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VaccinationRecordDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetVaccinationRecordByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<VaccinationRecordDto>> CreateAsync([FromBody] CreateVaccinationRecordDto request)
    {
        var result = await sender.Send(new CreateVaccinationRecordCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<VaccinationRecordDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateVaccinationRecordDto request)
    {
        var result = await sender.Send(new UpdateVaccinationRecordCommand(id, request));

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
        await sender.Send(new DeleteVaccinationRecordCommand(id));
        return NoContent();
    }
}
