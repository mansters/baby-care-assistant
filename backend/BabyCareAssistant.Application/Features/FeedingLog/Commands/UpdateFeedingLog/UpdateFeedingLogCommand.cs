using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;

public record UpdateFeedingLogCommand(Guid Id, UpdateFeedingLogDto Dto) : IRequest<Result<FeedingLogDto>>;

internal sealed class UpdateFeedingLogCommandHandler(IFeedingRepository feedingRepository, IMapper mapper)
    : IRequestHandler<UpdateFeedingLogCommand, Result<FeedingLogDto>>
{
    public async Task<Result<FeedingLogDto>> Handle(UpdateFeedingLogCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.Dto.Id)
        {
            return Result<FeedingLogDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var existingLog = await feedingRepository.GetByIdAsync(request.Id);
        if (existingLog == null)
        {
            return Result<FeedingLogDto>.Failure("Feeding log not found");
        }

        mapper.Map(request.Dto, existingLog);
        existingLog = await feedingRepository.UpdateAsync(existingLog);

        var dto = mapper.Map<FeedingLogDto>(existingLog);
        return Result<FeedingLogDto>.Success(dto);
    }
}
