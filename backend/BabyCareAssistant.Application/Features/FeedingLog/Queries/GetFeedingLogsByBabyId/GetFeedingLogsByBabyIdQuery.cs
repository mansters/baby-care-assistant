using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogsByBabyId;

public record GetFeedingLogsByBabyIdQuery(string BabyId, string? CursorSk, int Limit = 20) ;

public sealed class GetFeedingLogsByBabyIdQueryHandler(IFeedingRepository feedingRepository)
{
    public async Task<Result<List<FeedingLogDto>>> Handle(GetFeedingLogsByBabyIdQuery request, CancellationToken cancellationToken)
    {
        var logs = await feedingRepository.GetListByBabyIdAsync(request.BabyId, request.CursorSk, request.Limit, cancellationToken);
        var dtos = logs.Select(l => l.ToDto()).ToList();
        return Result<List<FeedingLogDto>>.Success(dtos);
    }
}
