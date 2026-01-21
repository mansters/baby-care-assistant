using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.API.Dtos.FeedingLog;

public record UpdateFeedingLogDto(
    [Required] Guid Id,
    [Required] DateTime FeedingTime,
    [Range(1, 1000)] int? DurationMinutes,
    [Required] FeedingType? Type,
    [Range(0, 500)] int AmountMl
);