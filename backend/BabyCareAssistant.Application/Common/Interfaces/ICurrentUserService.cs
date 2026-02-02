namespace BabyCareAssistant.Application.Common.Interfaces;

/// <summary>
/// Provides access to the current authenticated user's identity from the JWT token.
/// </summary>
public interface ICurrentUserService
{
    string? CognitoSubjectId { get; }

    bool IsAuthenticated { get; }
}