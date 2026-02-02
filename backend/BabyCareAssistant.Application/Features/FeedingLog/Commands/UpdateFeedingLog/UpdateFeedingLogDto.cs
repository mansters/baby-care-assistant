using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;

public record UpdateFeedingLogDto
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public DateTime FeedingTime { get; init; }

    [Range(1, 1000)]
    public int? DurationMinutes { get; init; }

    [Required]
    public FeedingType? Type { get; init; }

    [Range(0, 500)]
    public int AmountMl { get; init; }

    [MaxLength(3000, ErrorMessage = "Note must be less than 3000 characters")]
    public string? Note { get; init; }
}
