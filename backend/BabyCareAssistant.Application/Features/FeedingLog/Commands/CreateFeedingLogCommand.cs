using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.FeedingLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands;

public record CreateFeedingLogCommand(CreateFeedingLogDto Dto) : IRequest<Result<FeedingLogDto>>;

public class CreateFeedingLogCommandHandler(IFeedingRepository feedingRepository, IMapper mapper)
    : IRequestHandler<CreateFeedingLogCommand, Result<FeedingLogDto>>
{
    public async Task<Result<FeedingLogDto>> Handle(CreateFeedingLogCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<Domain.Entities.FeedingLog>(request.Dto);
        entity = await feedingRepository.CreateAsync(entity);

        var dto = mapper.Map<FeedingLogDto>(entity);
        return Result<FeedingLogDto>.Success(dto);
    }
}
