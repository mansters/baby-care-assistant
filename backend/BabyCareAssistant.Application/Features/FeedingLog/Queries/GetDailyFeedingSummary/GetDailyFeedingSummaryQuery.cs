using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetDailyFeedingSummary;

public record GetDailyFeedingSummaryQuery(string BabyId) ;

public sealed class GetDailyFeedingSummaryQueryHandler(IFeedingRepository feedingRepository)
{
    public async Task<Result<DailyFeedingSummaryDto>> Handle(
        GetDailyFeedingSummaryQuery request, CancellationToken cancellationToken)
    {
        var dailyTotals = await feedingRepository.GetDailyFormulaTotalsAsync(
            request.BabyId, cancellationToken);

        return Result<DailyFeedingSummaryDto>.Success(
            new DailyFeedingSummaryDto { DailyTotals = dailyTotals });
    }
}
