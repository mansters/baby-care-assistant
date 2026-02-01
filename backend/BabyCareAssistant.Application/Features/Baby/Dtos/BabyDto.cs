namespace BabyCareAssistant.Application.Features.Baby.Dtos;

public record BabyDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? PreferredName,
    DateTime DateOfBirth
);
