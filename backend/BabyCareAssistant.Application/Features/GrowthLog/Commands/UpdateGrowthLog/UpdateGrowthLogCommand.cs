using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;

public record UpdateGrowthLogCommand(Guid Id, UpdateGrowthLogDto Dto) : IRequest<Result<GrowthLogDto>>;

internal sealed class UpdateGrowthLogCommandHandler(IGrowthLogRepository growthLogRepository, IMapper mapper)
    : IRequestHandler<UpdateGrowthLogCommand, Result<GrowthLogDto>>
{
    public async Task<Result<GrowthLogDto>> Handle(UpdateGrowthLogCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.Dto.Id)
        {
            return Result<GrowthLogDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var entity = mapper.Map<Domain.Entities.GrowthLog>(request.Dto);
        var updatedEntity = await growthLogRepository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return Result<GrowthLogDto>.Failure("Growth log not found");
        }

        var dto = mapper.Map<GrowthLogDto>(updatedEntity);
        return Result<GrowthLogDto>.Success(dto);
    }
}
