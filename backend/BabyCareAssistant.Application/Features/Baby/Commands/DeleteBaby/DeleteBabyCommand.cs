using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Commands.DeleteBaby;

public record DeleteBabyCommand(string Id) : IRequest<Result>;

internal sealed class DeleteBabyCommandHandler(IBabyRepository babyRepository)
    : IRequestHandler<DeleteBabyCommand, Result>
{
    public async Task<Result> Handle(DeleteBabyCommand request, CancellationToken cancellationToken)
    {
        await babyRepository.DeleteAsync(request.Id, cancellationToken);
        return Result.Success();
    }
}
