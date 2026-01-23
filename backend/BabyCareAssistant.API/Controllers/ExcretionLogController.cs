using AutoMapper;
using BabyCareAssistant.Application.Dtos.ExcretionLog;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExcretionLogController(IExcretionLogRepository excretionLogRepository, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExcretionLogDto>>> GetAllAsync()
    {
        var logs = await excretionLogRepository.GetAllAsync();
        var dtos = mapper.Map<IEnumerable<ExcretionLogDto>>(logs);
        
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExcretionLogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var log = await excretionLogRepository.GetByIdAsync(id);

        if (log == null)
        {
            return NotFound();
        }
        
        var dto = mapper.Map<ExcretionLogDto>(log);
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ExcretionLogDto>> CreateAsync([FromBody] CreateExcretionLogDto request)
    {
        var entity = mapper.Map<ExcretionLog>(request);
        entity = await excretionLogRepository.CreateAsync(entity);
        
        var responseDto = mapper.Map<ExcretionLogDto>(entity);
        
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = entity.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExcretionLogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateExcretionLogDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the request body.");
        }
        
        var entity = mapper.Map<ExcretionLog>(request);
        var updatedEntity = await excretionLogRepository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return NotFound();
        }
        
        var responseDto = mapper.Map<ExcretionLogDto>(updatedEntity);
        return Ok(responseDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await excretionLogRepository.DeleteAsync(id);
        return NoContent();
    }
}
