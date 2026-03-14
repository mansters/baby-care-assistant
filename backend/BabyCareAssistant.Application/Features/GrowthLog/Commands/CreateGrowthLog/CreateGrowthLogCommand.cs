using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;

public record CreateGrowthLogCommand(CreateGrowthLogDto Dto) : IRequest<Result<GrowthLogDto>>;

internal sealed class CreateGrowthLogCommandHandler(IGrowthLogRepository growthLogRepository, IBabyRepository babyRepository)
    : IRequestHandler<CreateGrowthLogCommand, Result<GrowthLogDto>>
{
    public async Task<Result<GrowthLogDto>> Handle(CreateGrowthLogCommand request, CancellationToken cancellationToken)
    {
        var baby = await babyRepository.GetByIdAsync(request.Dto.BabyId, cancellationToken);
        if (baby == null) return Result<GrowthLogDto>.Failure("Baby not found");

        var entity = request.Dto.ToEntity();
        entity.Initialize(request.Dto.BabyId, request.Dto.EventTimeUtc, baby.TimeZone);

        entity = await growthLogRepository.CreateAsync(entity, cancellationToken);
        return Result<GrowthLogDto>.Success(entity.ToDto());

    }
}
