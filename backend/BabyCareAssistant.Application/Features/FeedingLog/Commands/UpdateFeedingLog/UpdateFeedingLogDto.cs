using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;

public record UpdateFeedingLogDto
{
    [Required]
    public string BabyId { get; init; } = string.Empty;

    [Required]
    public string SK { get; init; } = string.Empty;

    [Required]
    public DateTime LocalDateTime { get; init; }



    [Range(0, 500)]
    public int? LeftBreastDurationMinutes { get; init; }

    [Range(0, 500)]
    public int? RightBreastDurationMinutes { get; init; }

    [Required]
    public FeedingType? Type { get; init; }

    [Range(0, 500)]
    public int AmountMl { get; init; }

    [MaxLength(3000, ErrorMessage = "Note must be less than 3000 characters")]
    public string? Note { get; init; }
}
