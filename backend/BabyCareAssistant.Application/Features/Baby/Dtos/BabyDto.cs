namespace BabyCareAssistant.Application.Features.Baby.Dtos;

public record BabyDto
{
    public string Id { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? PreferredName { get; init; }
    public DateTime DateOfBirth { get; init; }
}
