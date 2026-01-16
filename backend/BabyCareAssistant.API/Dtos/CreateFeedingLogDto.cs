using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.API.Dtos;

public record CreateFeedingLogDto(
    [Required] Guid BabyId,
    [Required] DateTime FeedingTime,
    [Range(1, 1000)] int DurationMinutes,
    [Required] string Type, // "Breast" or "Bottle"
    [Range(0, 500)] int AmountMl
);