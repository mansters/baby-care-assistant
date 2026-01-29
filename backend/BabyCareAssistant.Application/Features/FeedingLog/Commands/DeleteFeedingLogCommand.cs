using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Commands;

public record DeleteFeedingLogCommand(Guid Id) : IRequest<Result>;

public class DeleteFeedingLogCommandHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<DeleteFeedingLogCommand, Result>
{
    public async Task<Result> Handle(DeleteFeedingLogCommand request, CancellationToken cancellationToken)
    {
        await feedingRepository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
