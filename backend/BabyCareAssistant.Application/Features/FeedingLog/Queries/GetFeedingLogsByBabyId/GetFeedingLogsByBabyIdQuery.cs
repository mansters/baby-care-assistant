using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogsByBabyId;

public record GetFeedingLogsByBabyIdQuery(string BabyId, string? CursorSk, int Limit = 20) : IRequest<Result<List<FeedingLogDto>>>;

internal sealed class GetFeedingLogsByBabyIdQueryHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<GetFeedingLogsByBabyIdQuery, Result<List<FeedingLogDto>>>
{
    public async Task<Result<List<FeedingLogDto>>> Handle(GetFeedingLogsByBabyIdQuery request, CancellationToken cancellationToken)
    {
        var logs = await feedingRepository.GetListByBabyIdAsync(request.BabyId, request.CursorSk, request.Limit, cancellationToken);
        var dtos = logs.Select(l => l.ToDto()).ToList();
        return Result<List<FeedingLogDto>>.Success(dtos);
    }
}
