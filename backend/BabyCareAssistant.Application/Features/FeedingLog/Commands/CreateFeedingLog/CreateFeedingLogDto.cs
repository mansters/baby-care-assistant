using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;

public record CreateFeedingLogDto
{
    [Required]
    public Guid BabyId { get; init; }

    [Required]
    public DateTime FeedingTime { get; init; }



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
