using AutoMapper;
using BabyCareAssistant.Application.Dtos.FeedingLog;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController(IFeedingRepository feedingRepository, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FeedingLogDto>>> GetAllAsync()
    {
        var feedingLogs = await feedingRepository.GetAllAsync();
        var feedingLogDtos = mapper.Map<List<FeedingLogDto>>(feedingLogs);

        return Ok(feedingLogDtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
    {
        var feedingLog = await feedingRepository.GetByIdAsync(id);

        if (feedingLog == null)
        {
            return NotFound();
        }

        var feedingLogDto = mapper.Map<FeedingLogDto>(feedingLog);
        return Ok(feedingLogDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateFeedingLogDto request)
    {
        var feedingLog = mapper.Map<FeedingLog>(request);
        feedingLog = await feedingRepository.CreateAsync(feedingLog);
        
        var responseDto = mapper.Map<FeedingLogDto>(feedingLog);
        
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = feedingLog.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateFeedingLogDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the request body.");
        }

        var feedingLog = await feedingRepository.GetByIdAsync(id);
        if (feedingLog == null)
        {
            return NotFound();
        }

        mapper.Map(request, feedingLog);

        feedingLog = await feedingRepository.UpdateAsync(feedingLog);

        var responseDto = mapper.Map<FeedingLogDto>(feedingLog);

        return Ok(responseDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await feedingRepository.DeleteAsync(id);
        return NoContent();
    }
}