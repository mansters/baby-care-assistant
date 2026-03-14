using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;

public record CreateExcretionLogCommand(CreateExcretionLogDto Dto) ;

public sealed class CreateExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository, IBabyRepository babyRepository)
{
    public async Task<Result<ExcretionLogDto>> Handle(CreateExcretionLogCommand request, CancellationToken cancellationToken)
    {
        var baby = await babyRepository.GetByIdAsync(request.Dto.BabyId, cancellationToken);
        if (baby == null)
        {
            return Result<ExcretionLogDto>.Failure("Baby not found");
        }

        var entity = request.Dto.ToEntity();
        entity.Initialize(request.Dto.BabyId, request.Dto.EventTimeUtc, baby.TimeZone);
        
        entity = await excretionLogRepository.CreateAsync(entity, cancellationToken);

        var dto = entity.ToDto();
        return Result<ExcretionLogDto>.Success(dto);
    }
}
