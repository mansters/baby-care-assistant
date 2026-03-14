using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogsByBabyId;

public record GetGrowthLogsByBabyIdQuery(string BabyId, string? CursorSk, int Limit = 20) ;

public sealed class GetGrowthLogsByBabyIdQueryHandler(IGrowthLogRepository growthLogRepository)
{
    public async Task<Result<List<GrowthLogDto>>> Handle(GetGrowthLogsByBabyIdQuery request, CancellationToken cancellationToken)
    {
        var logs = await growthLogRepository.GetListByBabyIdAsync(request.BabyId, request.CursorSk, request.Limit, cancellationToken);
        var dtos = logs.Select(l => l.ToDto()).ToList();
        return Result<List<GrowthLogDto>>.Success(dtos);
    }
}