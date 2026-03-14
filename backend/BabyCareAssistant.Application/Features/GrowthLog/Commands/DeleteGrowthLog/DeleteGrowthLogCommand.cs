using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.DeleteGrowthLog;

public record DeleteGrowthLogCommand(string BabyId, string Sk) ;

public sealed class DeleteGrowthLogCommandHandler(IGrowthLogRepository growthLogRepository)
{
    public async Task<Result> Handle(DeleteGrowthLogCommand request, CancellationToken cancellationToken)
    {
        await growthLogRepository.DeleteAsync(request.BabyId, request.Sk, cancellationToken);
        return Result.Success();
    }
}
