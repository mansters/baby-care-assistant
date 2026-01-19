using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.API.Dtos;

public record FeedingLogDto(
    Guid Id,
    Guid BabyId,
    DateTime FeedingTime,   // Matches Entity
    int? DurationMinutes,    // Matches Entity
    FeedingType Type,            // "Breast" or "Bottle"
    int AmountMl            // Matches Entity
);