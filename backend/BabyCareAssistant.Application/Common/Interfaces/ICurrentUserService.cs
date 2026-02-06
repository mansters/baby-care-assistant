namespace BabyCareAssistant.Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? CognitoSubjectId { get; }

    bool IsAuthenticated { get; }
}