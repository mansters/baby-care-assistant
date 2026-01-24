using AutoMapper;
using BabyCareAssistant.Application.Dtos.VaccineCatalog;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccineCatalogController(IVaccineCatalogRepository vaccineCatalogRepository, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaccineCatalogDto>>> GetAllAsync()
    {
        var catalogs = await vaccineCatalogRepository.GetAllAsync();
        var dtos = mapper.Map<IEnumerable<VaccineCatalogDto>>(catalogs);
        
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VaccineCatalogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var catalog = await vaccineCatalogRepository.GetByIdAsync(id);

        if (catalog == null)
        {
            return NotFound();
        }
        
        var dto = mapper.Map<VaccineCatalogDto>(catalog);
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<VaccineCatalogDto>> CreateAsync([FromBody] CreateVaccineCatalogDto request)
    {
        var entity = mapper.Map<VaccineCatalog>(request);
        entity = await vaccineCatalogRepository.CreateAsync(entity);
        
        var responseDto = mapper.Map<VaccineCatalogDto>(entity);
        
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = entity.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<VaccineCatalogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateVaccineCatalogDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the request body.");
        }
        
        var entity = mapper.Map<VaccineCatalog>(request);
        var updatedEntity = await vaccineCatalogRepository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return NotFound();
        }
        
        var responseDto = mapper.Map<VaccineCatalogDto>(updatedEntity);
        return Ok(responseDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await vaccineCatalogRepository.DeleteAsync(id);
        return NoContent();
    }
}
