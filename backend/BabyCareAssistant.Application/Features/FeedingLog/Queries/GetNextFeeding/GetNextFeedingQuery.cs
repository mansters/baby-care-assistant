using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetNextFeeding;

public record GetNextFeedingQuery(Guid BabyId) : IRequest<Result<NextFeedingDto>>;

internal sealed class GetNextFeedingQueryHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<GetNextFeedingQuery, Result<NextFeedingDto>>
{
    private const int RecentFeedingCount = 10;

    public async Task<Result<NextFeedingDto>> Handle(
        GetNextFeedingQuery request, CancellationToken cancellationToken)
    {
        var latestFeeding = await feedingRepository.GetLatestAsync(
            request.BabyId, cancellationToken);

        if (latestFeeding == null)
        {
            return Result<NextFeedingDto>.Success(new NextFeedingDto(null, null));
        }

        var recentTimes = await feedingRepository.GetRecentFeedingTimesAsync(
            request.BabyId, RecentFeedingCount, cancellationToken);

        DateTime? nextFeedingTime = null;

        if (recentTimes.Count >= 2)
        {
            var sortedTimes = recentTimes.OrderBy(t => t).ToList();
            var intervals = new List<double>();

            for (var i = 1; i < sortedTimes.Count; i++)
            {
                intervals.Add((sortedTimes[i] - sortedTimes[i - 1]).TotalMinutes);
            }

            var averageIntervalMinutes = intervals.Average();
            nextFeedingTime = latestFeeding.FeedingTime.AddMinutes(averageIntervalMinutes);
        }

        return Result<NextFeedingDto>.Success(
            new NextFeedingDto(latestFeeding.FeedingTime, nextFeedingTime));
    }
}
