using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccineCatalog;
using BabyCareAssistant.Application.Features.VaccineCatalog.Commands;
using BabyCareAssistant.Application.Features.VaccineCatalog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccineCatalogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaccineCatalogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllVaccineCatalogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VaccineCatalogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetVaccineCatalogByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<VaccineCatalogDto>> CreateAsync([FromBody] CreateVaccineCatalogDto request)
    {
        var result = await sender.Send(new CreateVaccineCatalogCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<VaccineCatalogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateVaccineCatalogDto request)
    {
        var result = await sender.Send(new UpdateVaccineCatalogCommand(id, request));

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
        await sender.Send(new DeleteVaccineCatalogCommand(id));
        return NoContent();
    }
}
