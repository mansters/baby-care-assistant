using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.VaccinationRecord.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands.UpdateVaccinationRecord;

public record UpdateVaccinationRecordCommand(Guid Id, UpdateVaccinationRecordDto Dto) : IRequest<Result<VaccinationRecordDto>>;

internal sealed class UpdateVaccinationRecordCommandHandler(IVaccinationRecordRepository repository, IMapper mapper)
    : IRequestHandler<UpdateVaccinationRecordCommand, Result<VaccinationRecordDto>>
{
    public async Task<Result<VaccinationRecordDto>> Handle(UpdateVaccinationRecordCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.Dto.Id)
        {
            return Result<VaccinationRecordDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var entity = mapper.Map<Domain.Entities.VaccinationRecord>(request.Dto);
        var updatedEntity = await repository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return Result<VaccinationRecordDto>.Failure("Vaccination record not found");
        }

        var dto = mapper.Map<VaccinationRecordDto>(updatedEntity);
        return Result<VaccinationRecordDto>.Success(dto);
    }
}
