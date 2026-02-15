using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.FeedingLog.Dtos;

public record FeedingLogDto
{
    public Guid Id { get; init; }
    public Guid BabyId { get; init; }
    public DateTime FeedingTime { get; init; }

    public int? LeftBreastDurationMinutes { get; init; }
    public int? RightBreastDurationMinutes { get; init; }
    public FeedingType Type { get; init; }
    public int AmountMl { get; init; }
    public string? Note { get; init; }
}
