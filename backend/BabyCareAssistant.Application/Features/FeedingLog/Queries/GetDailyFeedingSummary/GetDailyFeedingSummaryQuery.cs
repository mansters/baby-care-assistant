using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetDailyFeedingSummary;

public record GetDailyFeedingSummaryQuery(Guid BabyId, string TimeZoneId) : IRequest<Result<DailyFeedingSummaryDto>>;

internal sealed class GetDailyFeedingSummaryQueryHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<GetDailyFeedingSummaryQuery, Result<DailyFeedingSummaryDto>>
{
    public async Task<Result<DailyFeedingSummaryDto>> Handle(
        GetDailyFeedingSummaryQuery request, CancellationToken cancellationToken)
    {
        var dailyTotals = await feedingRepository.GetDailyFormulaTotalsAsync(
            request.BabyId, request.TimeZoneId, cancellationToken);

        return Result<DailyFeedingSummaryDto>.Success(
            new DailyFeedingSummaryDto { DailyTotals = dailyTotals });
    }
}
