namespace BabyCareAssistant.Application.Features.FeedingLog.Dtos;

public record NextFeedingDto(DateTime? LastFeedingTime, DateTime? NextFeedingTime);
