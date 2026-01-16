using BabyCareAssistant.API.Dtos;
using BabyCareAssistant.API.Services;
using BabyCareAssistant.Domain.Entities.Feeding;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController(IFeedingService feedingService) : ControllerBase
{
    
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FeedingLogDto>>> GetAllAsync()
    {
        var logs = await feedingService.GetAllAsync(); 

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
    
    [HttpGet("{id:guid}", Name = "GetFeedingLogById")]
    public async Task<IActionResult> GetAsync(Guid id)
    {
        var log = await feedingService.GetAsync(id);
        
        if (log == null)
        {
            return NotFound(); // Returns 404
        }
        
        return Ok(log);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateFeedingLogDto request)
    {
        // 1. Manual Mapping (Later we use AutoMapper)
        var entity = new FeedingLog
        {
            Id = Guid.NewGuid(),
            BabyId = request.BabyId,
            FeedingTime = request.FeedingTime,
            DurationMinutes = request.DurationMinutes,
            Type = request.Type,
            AmountMl = request.AmountMl
        };

        // 2. Pass Entity to Service
        await feedingService.AddAsync(entity);

        // 3. Return the READ Dto, not the Entity
        var responseDto = new FeedingLogDto(
            entity.Id,
            entity.BabyId,
            entity.FeedingTime,
            entity.DurationMinutes,
            entity.Type,
            entity.AmountMl
        );

        return CreatedAtRoute("GetFeedingLogById", new { id = entity.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync(Guid id, UpdateFeedingLogDto log)
    {
        var existingLog = await feedingService.GetAsync(id);
        if (existingLog == null) return NotFound();
        
        existingLog.FeedingTime = log.FeedingTime;
        existingLog.DurationMinutes = log.DurationMinutes;
        existingLog.Type = log.Type;
        existingLog.AmountMl = log.AmountMl;
        
        await feedingService.UpdateAsync(existingLog);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await feedingService.DeleteAsync(id);
        return NoContent();
    }
}