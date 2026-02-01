using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;

public record CreateFeedingLogCommand(CreateFeedingLogDto Dto) : IRequest<Result<FeedingLogDto>>;

internal sealed class CreateFeedingLogCommandHandler(IFeedingRepository feedingRepository, IMapper mapper)
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
