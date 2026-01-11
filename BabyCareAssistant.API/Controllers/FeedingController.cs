using BabyCareAssistant.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController : ControllerBase
{
    private readonly IFeedingService _feedingService;

    public FeedingController(IFeedingService feedingService)
    {
        _feedingService = feedingService;
    }
    
    
    [HttpGet]
    public IActionResult GetAllFeedings()
    {
        var data = _feedingService.GetAll();
        return Ok(data);
    }
}