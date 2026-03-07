using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;

public record CreateFeedingLogCommand(CreateFeedingLogDto Dto) : IRequest<Result<FeedingLogDto>>;

internal sealed class CreateFeedingLogCommandHandler(IFeedingRepository feedingRepository, IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<CreateFeedingLogCommand, Result<FeedingLogDto>>
{
    public async Task<Result<FeedingLogDto>> Handle(CreateFeedingLogCommand request, CancellationToken cancellationToken)
    {
        var baby = await babyRepository.GetByIdAsync(request.Dto.BabyId, cancellationToken);
        if (baby == null)
        {
            return Result<FeedingLogDto>.Failure("Baby not found");
        }

        var entity = mapper.Map<Domain.Entities.FeedingLog>(request.Dto);
        entity.Initialize(request.Dto.BabyId, request.Dto.LocalDateTime, baby.TimeZone);
        
        entity = await feedingRepository.CreateAsync(entity, cancellationToken);

        var dto = mapper.Map<FeedingLogDto>(entity);
        return Result<FeedingLogDto>.Success(dto);
    }
}
