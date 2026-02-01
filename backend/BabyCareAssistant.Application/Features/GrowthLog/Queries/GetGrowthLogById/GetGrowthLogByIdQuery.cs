using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogById;

public record GetGrowthLogByIdQuery(Guid Id) : IRequest<Result<GrowthLogDto>>;

internal sealed class GetGrowthLogByIdQueryHandler(IGrowthLogRepository growthLogRepository, IMapper mapper)
    : IRequestHandler<GetGrowthLogByIdQuery, Result<GrowthLogDto>>
{
    public async Task<Result<GrowthLogDto>> Handle(GetGrowthLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await growthLogRepository.GetByIdAsync(request.Id);

        if (log == null)
        {
            return Result<GrowthLogDto>.Failure("Growth log not found");
        }

        var dto = mapper.Map<GrowthLogDto>(log);
        return Result<GrowthLogDto>.Success(dto);
    }
}
