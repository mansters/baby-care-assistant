using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetDailyFeedingSummary;

public record GetDailyFeedingSummaryQuery(string BabyId) : IRequest<Result<DailyFeedingSummaryDto>>;

internal sealed class GetDailyFeedingSummaryQueryHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<GetDailyFeedingSummaryQuery, Result<DailyFeedingSummaryDto>>
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
