namespace BabyCareAssistant.API.Dtos;

public record FeedingLogDto(
    Guid Id,
    Guid BabyId,
    DateTime FeedingTime,   // Matches Entity
    int DurationMinutes,    // Matches Entity
    string Type,            // "Breast" or "Bottle"
    int AmountMl            // Matches Entity
);