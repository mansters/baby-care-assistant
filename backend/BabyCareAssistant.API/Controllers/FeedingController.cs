using BabyCareAssistant.API.Dtos;
using BabyCareAssistant.API.Repositories;
using BabyCareAssistant.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController(IFeedingRepository feedingRepository) : ControllerBase
{
    
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FeedingLogDto>>> GetAllAsync()
    {
        var logs = await feedingRepository.GetAllAsync(); 

        var dtos = logs.Select(log => new FeedingLogDto(
            log.Id,
            log.BabyId,
            log.FeedingTime,
            log.DurationMinutes,
            log.Type,
            log.AmountMl
        ));

        return Ok(dtos);
    }
    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
    {
        var log = await feedingRepository.GetByIdAsync(id);
    
        if (log == null)
        {
            return NotFound();
        }

        
        var dto = new FeedingLogDto(
            log.Id,
            log.BabyId,
            log.FeedingTime,
            log.DurationMinutes,
            log.Type,
            log.AmountMl
        );
    
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateFeedingLogDto request)
    {
        
        var entity = new FeedingLog
        {
            Id = Guid.NewGuid(),
            BabyId = request.BabyId,
            FeedingTime = request.FeedingTime,
            DurationMinutes = request.DurationMinutes,
            Type = request.Type!.Value,
            AmountMl = request.AmountMl
        };

        
        entity = await feedingRepository.CreateAsync(entity);

        
        var responseDto = new FeedingLogDto(
            entity.Id,
            entity.BabyId,
            entity.FeedingTime,
            entity.DurationMinutes,
            entity.Type,
            entity.AmountMl
        );

        return CreatedAtRoute(nameof(GetByIdAsync), new { id = entity.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateFeedingLogDto log)
    {
        if (id != log.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the request body.");
        }
        
        var existingLog = await feedingRepository.GetByIdAsync(id);
        if (existingLog == null)
        {
            return NotFound();
        }
        
        existingLog.FeedingTime = log.FeedingTime;
        existingLog.DurationMinutes = log.DurationMinutes;
        existingLog.Type = log.Type!.Value;
        existingLog.AmountMl = log.AmountMl;
        
        existingLog = await feedingRepository.UpdateAsync(existingLog);

        var response = new FeedingLogDto(
            existingLog!.Id,
            existingLog.BabyId,
            existingLog.FeedingTime,
            existingLog.DurationMinutes,
            existingLog.Type,
            existingLog.AmountMl
            
        );
        
        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await feedingRepository.DeleteAsync(id);
        return NoContent();
    }
}