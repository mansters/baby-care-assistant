using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands.DeleteFeedingLog;

public record DeleteFeedingLogCommand(string BabyId, string Sk) ;

public sealed class DeleteFeedingLogCommandHandler(IFeedingRepository feedingRepository)
{
    public async Task<Result> Handle(DeleteFeedingLogCommand request, CancellationToken cancellationToken)
    {
        await feedingRepository.DeleteAsync(request.BabyId, request.Sk, cancellationToken);
        return Result.Success();
    }
}
