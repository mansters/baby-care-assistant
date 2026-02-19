namespace BabyCareAssistant.Application.Features.FeedingLog.Dtos;

public record DailyFeedingSummaryDto
{
    public Dictionary<string, DailyFeedingInfo> DailyTotals { get; init; } = new();
}

public record DailyFeedingInfo(int TotalMl, int FeedCount);
