using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.DeleteGrowthLog;

public record DeleteGrowthLogCommand(string BabyId, string Sk) : IRequest<Result>;

internal sealed class DeleteGrowthLogCommandHandler(IGrowthLogRepository growthLogRepository)
    : IRequestHandler<DeleteGrowthLogCommand, Result>
{
    public async Task<Result> Handle(DeleteGrowthLogCommand request, CancellationToken cancellationToken)
    {
        await growthLogRepository.DeleteAsync(request.BabyId, request.Sk, cancellationToken);
        return Result.Success();
    }
}
