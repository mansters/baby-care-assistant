using AutoMapper;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BabyController(IBabyRepository babyRepository, IMapper mapper): ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BabyDto>>> GetAllAsync()
    {
        var baby = await babyRepository.GetAllAsync();
        var babyDtos = mapper.Map<List<BabyDto>>(baby);
        
        return Ok(babyDtos);
    }

    [HttpGet("{id:guid}", Name = "GetByIdAsync")]
    public async Task<ActionResult<BabyDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var entity = await babyRepository.GetByIdAsync(id);

        if (entity == null)
        {
            return NotFound();
        }
        
        var babyDto = mapper.Map<BabyDto>(entity);
        return Ok(babyDto);
    }

    [HttpPost]
    public async Task<ActionResult<BabyDto>> CreateAsync([FromBody] CreateBabyDto request)
    {
        var entity = mapper.Map<Baby>(request);
        entity = await babyRepository.CreateAsync(entity);
        
        var responseDto = mapper.Map<BabyDto>(entity);
        
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = entity.Id }, responseDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BabyDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateBabyDto request)
    {
        if (id != request.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the request body.");
        }
        
        var entity = mapper.Map<Baby>(request);
        var updatedEntity = await babyRepository.UpdateAsync(entity);
        
        if (updatedEntity == null)
        {
            return NotFound();
        }
        
        var responseDto = mapper.Map<BabyDto>(updatedEntity);
        return Ok(responseDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await babyRepository.DeleteAsync(id);
        return NoContent();
    }
}