using BabyCareAssistant.Application.Features.Baby.Dtos;

namespace BabyCareAssistant.Application.Features.Users.Queries.GetUserContext;


public record UserContextDto
{
    public string Status { get; init; } = "Ready";
    public UserProfileDto UserProfile { get; set; } = new();
    public List<ContextFamilyDto> Families { get; set; } = new();
}

public record UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string CognitoSubjectId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}

public record ContextFamilyDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Role { get; set; }
    public List<BabyDto> Babies { get; set; } = new();
}