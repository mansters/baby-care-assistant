using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands;

public record DeleteVaccinationRecordCommand(Guid Id) : IRequest<Result>;

public class DeleteVaccinationRecordCommandHandler(IVaccinationRecordRepository repository)
    : IRequestHandler<DeleteVaccinationRecordCommand, Result>
{
    public async Task<Result> Handle(DeleteVaccinationRecordCommand request, CancellationToken cancellationToken)
    {
        await repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
