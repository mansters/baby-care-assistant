using AutoMapper;
using BabyCareAssistant.Application.Dtos.GrowthLog;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GrowthLogController(IGrowthLogRepository growthLogRepository, IMapper mapper): ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GrowthLogDto>>> GetAllAsync()
    {
        var growthLogs = await growthLogRepository.GetAllAsync();
        var growthLogDtos = mapper.Map<IEnumerable<GrowthLog>>(growthLogs);
        
        return Ok(growthLogDtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
    {
        var growthLog = await growthLogRepository.GetByIdAsync(id);

        if (growthLog == null)
        {
            return NotFound();
        }
        
        var growthLogDto = mapper.Map<GrowthLog>(growthLog);
        return Ok(growthLogDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateGrowthLogDto request)
    {
        var growthLog = mapper.Map<GrowthLog>(request);
        growthLog = await growthLogRepository.CreateAsync(growthLog);
        
        var responseDto = mapper.Map<GrowthLogDto>(growthLog);
        
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = growthLog.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateGrowthLogDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the request body.");
        }
        
        var entity = mapper.Map<GrowthLog>(request);
        var updatedEntity = await growthLogRepository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return NotFound();
        }
        
        var responseDto = mapper.Map<GrowthLogDto>(updatedEntity);
        return Ok(responseDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await growthLogRepository.DeleteAsync(id);
        return NoContent();
    }
}