using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.VaccinationRecord.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands.CreateVaccinationRecord;

public record CreateVaccinationRecordCommand(CreateVaccinationRecordDto Dto) : IRequest<Result<VaccinationRecordDto>>;

internal sealed class CreateVaccinationRecordCommandHandler(IVaccinationRecordRepository repository, IMapper mapper)
    : IRequestHandler<CreateVaccinationRecordCommand, Result<VaccinationRecordDto>>
{
    public async Task<Result<VaccinationRecordDto>> Handle(CreateVaccinationRecordCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<Domain.Entities.VaccinationRecord>(request.Dto);
        entity = await repository.CreateAsync(entity);

        var dto = mapper.Map<VaccinationRecordDto>(entity);
        return Result<VaccinationRecordDto>.Success(dto);
    }
}
