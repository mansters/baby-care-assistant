namespace BabyCareAssistant.Application.Dtos.Baby;

public record BabyDto(
    Guid Id,
    string FirstName,
    string LastName,
    DateTime DateOfBirth
);