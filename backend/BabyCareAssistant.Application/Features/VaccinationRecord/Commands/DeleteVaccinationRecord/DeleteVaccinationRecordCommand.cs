using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands.DeleteVaccinationRecord;

public record DeleteVaccinationRecordCommand(Guid Id) : IRequest<Result>;

internal sealed class DeleteVaccinationRecordCommandHandler(IVaccinationRecordRepository repository)
    : IRequestHandler<DeleteVaccinationRecordCommand, Result>
{
    public async Task<Result> Handle(DeleteVaccinationRecordCommand request, CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
