using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccinationRecord;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands;

public record CreateVaccinationRecordCommand(CreateVaccinationRecordDto Dto) : IRequest<Result<VaccinationRecordDto>>;

public class CreateVaccinationRecordCommandHandler(IVaccinationRecordRepository repository, IMapper mapper)
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
