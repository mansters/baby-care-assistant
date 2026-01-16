using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.API.Dtos;

public record UpdateFeedingLogDto(
    DateTime FeedingTime,
    int DurationMinutes,
    string Type,
    int AmountMl
);