using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.FeedingLog.Dtos;

public record FeedingLogDto
{
    public string BabyId { get; init; } = string.Empty;
    public string SK { get; init; } = string.Empty;
    public DateTime EventTimeUtc { get; init; }

    public int? LeftBreastDurationMinutes { get; init; }
    public int? RightBreastDurationMinutes { get; init; }
    public FeedingType Type { get; init; }
    public int AmountMl { get; init; }
    public string? Note { get; init; }
}
