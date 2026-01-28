using AutoMapper;
using BabyCareAssistant.Application.Dtos.VaccinationRecord;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccinationRecordController(IVaccinationRecordRepository vaccinationRecordRepository, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaccinationRecordDto>>> GetAllAsync()
    {
        var records = await vaccinationRecordRepository.GetAllAsync();
        var dtos = mapper.Map<IEnumerable<VaccinationRecordDto>>(records);
        
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VaccinationRecordDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var record = await vaccinationRecordRepository.GetByIdAsync(id);

        if (record == null)
        {
            return NotFound();
        }
        
        var dto = mapper.Map<VaccinationRecordDto>(record);
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<VaccinationRecordDto>> CreateAsync([FromBody] CreateVaccinationRecordDto request)
    {
        var entity = mapper.Map<VaccinationRecord>(request);
        entity = await vaccinationRecordRepository.CreateAsync(entity);
        
        var responseDto = mapper.Map<VaccinationRecordDto>(entity);
        
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = entity.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<VaccinationRecordDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateVaccinationRecordDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the request body.");
        }
        
        var entity = mapper.Map<VaccinationRecord>(request);
        var updatedEntity = await vaccinationRecordRepository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return NotFound();
        }
        
        var responseDto = mapper.Map<VaccinationRecordDto>(updatedEntity);
        return Ok(responseDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await vaccinationRecordRepository.DeleteAsync(id);
        return NoContent();
    }
}
