using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;

namespace BabyCareAssistant.Application.Features.Baby.Commands.DeleteBaby;

public record DeleteBabyCommand(string Id) ;

public sealed class DeleteBabyCommandHandler(IBabyRepository babyRepository)
{
    public async Task<Result> Handle(DeleteBabyCommand request, CancellationToken cancellationToken)
    {
        await babyRepository.DeleteAsync(request.Id, cancellationToken);
        return Result.Success();
    }
}
