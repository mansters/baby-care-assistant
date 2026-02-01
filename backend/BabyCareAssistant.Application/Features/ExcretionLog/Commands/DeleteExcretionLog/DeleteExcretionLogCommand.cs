using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.DeleteExcretionLog;

public record DeleteExcretionLogCommand(Guid Id) : IRequest<Result>;

internal sealed class DeleteExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository)
    : IRequestHandler<DeleteExcretionLogCommand, Result>
{
    public async Task<Result> Handle(DeleteExcretionLogCommand request, CancellationToken cancellationToken)
    {
        await excretionLogRepository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
