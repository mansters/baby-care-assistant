using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.GrowthLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands;

public record CreateGrowthLogCommand(CreateGrowthLogDto Dto) : IRequest<Result<GrowthLogDto>>;

public class CreateGrowthLogCommandHandler(IGrowthLogRepository growthLogRepository, IMapper mapper)
    : IRequestHandler<CreateGrowthLogCommand, Result<GrowthLogDto>>
{
    public async Task<Result<GrowthLogDto>> Handle(CreateGrowthLogCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<Domain.Entities.GrowthLog>(request.Dto);
        entity = await growthLogRepository.CreateAsync(entity);

        var dto = mapper.Map<GrowthLogDto>(entity);
        return Result<GrowthLogDto>.Success(dto);
    }
}
