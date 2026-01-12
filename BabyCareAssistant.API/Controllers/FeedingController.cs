using BabyCareAssistant.API.Services;
using BabyCareAssistant.Domain.Entities.Feeding;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController(IFeedingService feedingService) : ControllerBase
{
    
    
    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var logs = await feedingService.GetAllAsync(); // 2. Await the service
        return Ok(logs);
    }
    
    [HttpGet("{id:guid}", Name = "GetFeedingLogById")]
    public async Task<IActionResult> GetAsync(Guid id)
    {
        var log = await feedingService.GetAsync(id);
        
        // FIX: Handle Nulls
        if (log == null)
        {
            return NotFound(); // Returns 404
        }
        
        return Ok(log);
    }

    [HttpPost]
    public async Task<IActionResult> Create(FeedingLog log)
    {
        await feedingService.AddAsync(log);
        return CreatedAtRoute("GetFeedingLogById", new { id = log.Id }, log);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, FeedingLog log)
    {
        if (id != log.Id) return BadRequest();
        
        await feedingService.UpdateAsync(log);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await feedingService.DeleteAsync(id);
        return NoContent();
    }
}