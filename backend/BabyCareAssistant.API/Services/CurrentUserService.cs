using System.Security.Claims;
using BabyCareAssistant.Application.Common.Interfaces;

namespace BabyCareAssistant.API.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string? UserId => httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
}