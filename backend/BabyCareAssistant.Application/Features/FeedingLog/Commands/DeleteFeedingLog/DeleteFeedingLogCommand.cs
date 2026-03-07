using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.DeleteFeedingLog;

public record DeleteFeedingLogCommand(string BabyId, string Sk) : IRequest<Result>;

internal sealed class DeleteFeedingLogCommandHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<DeleteFeedingLogCommand, Result>
{
    public async Task<Result> Handle(DeleteFeedingLogCommand request, CancellationToken cancellationToken)
    {
        await feedingRepository.DeleteAsync(request.BabyId, request.Sk, cancellationToken);
        return Result.Success();
    }
}
