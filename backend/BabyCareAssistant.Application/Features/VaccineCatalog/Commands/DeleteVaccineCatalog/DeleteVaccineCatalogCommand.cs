using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Commands.DeleteVaccineCatalog;

public record DeleteVaccineCatalogCommand(Guid Id) : IRequest<Result>;

internal sealed class DeleteVaccineCatalogCommandHandler(IVaccineCatalogRepository repository)
    : IRequestHandler<DeleteVaccineCatalogCommand, Result>
{
    public async Task<Result> Handle(DeleteVaccineCatalogCommand request, CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
