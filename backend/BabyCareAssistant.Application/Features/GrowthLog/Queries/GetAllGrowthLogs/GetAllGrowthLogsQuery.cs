using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.GrowthLog.Queries.GetAllGrowthLogs;

public record GetAllGrowthLogsQuery : IRequest<Result<List<GrowthLogDto>>>;

internal sealed class GetAllGrowthLogsQueryHandler(IGrowthLogRepository growthLogRepository, IMapper mapper)
    : IRequestHandler<GetAllGrowthLogsQuery, Result<List<GrowthLogDto>>>
{
    public async Task<Result<List<GrowthLogDto>>> Handle(GetAllGrowthLogsQuery request, CancellationToken cancellationToken)
    {
        var logs = await growthLogRepository.GetAllAsync();
        var dtos = mapper.Map<List<GrowthLogDto>>(logs);
        return Result<List<GrowthLogDto>>.Success(dtos);
    }
}
