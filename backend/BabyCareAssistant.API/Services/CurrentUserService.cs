using System.Security.Claims;
using BabyCareAssistant.Application.Common.Interfaces;

namespace BabyCareAssistant.API.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private readonly ClaimsPrincipal? _user = httpContextAccessor.HttpContext?.User;

    public string? CognitoSubjectId => _user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public bool IsAuthenticated => _user?.Identity?.IsAuthenticated ?? false;
}