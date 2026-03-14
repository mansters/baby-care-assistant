using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;

public record CreateFeedingLogCommand(CreateFeedingLogDto Dto) ;

public sealed class CreateFeedingLogCommandHandler(IFeedingRepository feedingRepository, IBabyRepository babyRepository)
{
    public async Task<Result<FeedingLogDto>> Handle(CreateFeedingLogCommand request, CancellationToken cancellationToken)
    {
        var baby = await babyRepository.GetByIdAsync(request.Dto.BabyId, cancellationToken);
        if (baby == null)
        {
            return Result<FeedingLogDto>.Failure("Baby not found");
        }

        var entity = request.Dto.ToEntity();
        entity.Initialize(request.Dto.BabyId, request.Dto.EventTimeUtc, baby.TimeZone);
        
        entity = await feedingRepository.CreateAsync(entity, cancellationToken);

        var dto = entity.ToDto();
        return Result<FeedingLogDto>.Success(dto);
    }
}
