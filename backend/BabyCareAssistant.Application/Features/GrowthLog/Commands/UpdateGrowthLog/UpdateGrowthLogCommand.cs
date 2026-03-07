using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;

public record UpdateGrowthLogCommand(string BabyId, string Sk, UpdateGrowthLogDto Dto) : IRequest<Result<GrowthLogDto>>;

internal sealed class UpdateGrowthLogCommandHandler(IGrowthLogRepository growthLogRepository, IMapper mapper)
    : IRequestHandler<UpdateGrowthLogCommand, Result<GrowthLogDto>>
{
    public async Task<Result<GrowthLogDto>> Handle(UpdateGrowthLogCommand request, CancellationToken cancellationToken)
    {
        if (request.BabyId != request.Dto.BabyId || request.Sk != request.Dto.SK)
            return Result<GrowthLogDto>.Failure("IDs in URL do not match body.");

        var updatedEntity = await growthLogRepository.UpdateAsync(request.BabyId, request.Sk, existingLog =>
        {
            mapper.Map(request.Dto, existingLog);
        }, cancellationToken);

        if (updatedEntity == null) return Result<GrowthLogDto>.Failure("Growth log not found");
        return Result<GrowthLogDto>.Success(mapper.Map<GrowthLogDto>(updatedEntity));

    }
}
