using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.GrowthLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.GrowthLog.Queries;

public record GetAllGrowthLogsQuery : IRequest<Result<List<GrowthLogDto>>>;

public class GetAllGrowthLogsQueryHandler(IGrowthLogRepository growthLogRepository, IMapper mapper)
    : IRequestHandler<GetAllGrowthLogsQuery, Result<List<GrowthLogDto>>>
{
    public async Task<Result<List<GrowthLogDto>>> Handle(GetAllGrowthLogsQuery request, CancellationToken cancellationToken)
    {
        var logs = await growthLogRepository.GetAllAsync();
        var dtos = mapper.Map<List<GrowthLogDto>>(logs);
        return Result<List<GrowthLogDto>>.Success(dtos);
    }
}
