using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.DeleteExcretionLog;

public record DeleteExcretionLogCommand(string BabyId, string Sk) ;

public sealed class DeleteExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository)
{
    public async Task<Result> Handle(DeleteExcretionLogCommand request, CancellationToken cancellationToken)
    {
        await excretionLogRepository.DeleteAsync(request.BabyId, request.Sk, cancellationToken);
        return Result.Success();
    }
}
