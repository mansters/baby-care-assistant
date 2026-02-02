using BabyCareAssistant.Application.Features.Users.Queries.GetUserContext;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UsersController(ISender sender) : ControllerBase
{
    [HttpGet("me/context")]
    public async Task<ActionResult<UserContextDto>> GetMyContext()
    {
        var result = await sender.Send(new GetUserContextQuery());

        return Ok(result.Value);
    }
}