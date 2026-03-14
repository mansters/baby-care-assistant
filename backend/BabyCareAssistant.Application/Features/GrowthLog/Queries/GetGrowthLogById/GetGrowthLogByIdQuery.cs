using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogById;

public record GetGrowthLogByIdQuery(string BabyId, string Sk) ;

public sealed class GetGrowthLogByIdQueryHandler(IGrowthLogRepository growthLogRepository)
{
    public async Task<Result<GrowthLogDto>> Handle(GetGrowthLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await growthLogRepository.GetByKeyAsync(request.BabyId, request.Sk, cancellationToken);
        if (log == null) return Result<GrowthLogDto>.Failure("Growth log not found");
        return Result<GrowthLogDto>.Success(log.ToDto());
    }
}
