using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Services;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetNextFeeding;

public record GetNextFeedingQuery(string BabyId) : IRequest<Result<NextFeedingDto>>;

internal sealed class GetNextFeedingQueryHandler(
    IFeedingRepository feedingRepository,
    IGrowthLogRepository growthLogRepository,
    FeedingPredictionService predictionService)
    : IRequestHandler<GetNextFeedingQuery, Result<NextFeedingDto>>
{
    private const int RecentFeedingCount = 10;

    public async Task<Result<NextFeedingDto>> Handle(
        GetNextFeedingQuery request, CancellationToken cancellationToken)
    {
        var latestFeeding = await feedingRepository.GetLatestAsync(
            request.BabyId, cancellationToken);
            
        var latestGrowth = await growthLogRepository.GetLatestAsync(
            request.BabyId, cancellationToken);

        if (latestFeeding == null)
        {
            // If no feedings at all, predict based on growth weight fallback 
            // per the Tier 3 algorithm
            var prediction = predictionService.PredictNextFeeding(new List<BabyCareAssistant.Domain.Entities.FeedingLog>(), latestGrowth);
            return Result<NextFeedingDto>.Success(new NextFeedingDto(null, prediction.NextFeedingTime, prediction.NextAmountMl));
        }

        var recentLogs = await feedingRepository.GetListByBabyIdAsync(
            request.BabyId, null, RecentFeedingCount, cancellationToken);

        // Calculate prediction using the domain service
        var predictionResult = predictionService.PredictNextFeeding(recentLogs, latestGrowth);

        return Result<NextFeedingDto>.Success(
            new NextFeedingDto(
                latestFeeding.EventTimeUtc, 
                predictionResult.NextFeedingTime, 
                predictionResult.NextAmountMl));
    }
}
