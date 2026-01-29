using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Commands;

public record DeleteBabyCommand(Guid Id) : IRequest<Result>;

public class DeleteBabyCommandHandler(IBabyRepository babyRepository)
    : IRequestHandler<DeleteBabyCommand, Result>
{
    public async Task<Result> Handle(DeleteBabyCommand request, CancellationToken cancellationToken)
    {
        await babyRepository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
