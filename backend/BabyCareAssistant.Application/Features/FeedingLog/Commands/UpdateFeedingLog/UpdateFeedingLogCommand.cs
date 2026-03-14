using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;

public record UpdateFeedingLogCommand(string BabyId, string Sk, UpdateFeedingLogDto Dto) : IRequest<Result<FeedingLogDto>>;

internal sealed class UpdateFeedingLogCommandHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<UpdateFeedingLogCommand, Result<FeedingLogDto>>
{
    public async Task<Result<FeedingLogDto>> Handle(UpdateFeedingLogCommand request, CancellationToken cancellationToken)
    {
        if (request.BabyId != request.Dto.BabyId || request.Sk != request.Dto.SK)
        {
            return Result<FeedingLogDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var existingLog = await feedingRepository.GetByKeyAsync(request.BabyId, request.Sk, cancellationToken);
        if (existingLog == null)
        {
            return Result<FeedingLogDto>.Failure("Feeding log not found");
        }

        request.Dto.UpdateEntity(existingLog);
        var updatedLog = await feedingRepository.UpdateAsync(request.BabyId, request.Sk, existingLog, cancellationToken);

        var dto = updatedLog.ToDto();
        return Result<FeedingLogDto>.Success(dto);
    }
}
