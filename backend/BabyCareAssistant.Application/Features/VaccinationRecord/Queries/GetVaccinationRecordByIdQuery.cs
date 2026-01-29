using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccinationRecord;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Queries;

public record GetVaccinationRecordByIdQuery(Guid Id) : IRequest<Result<VaccinationRecordDto>>;

public class GetVaccinationRecordByIdQueryHandler(IVaccinationRecordRepository repository, IMapper mapper)
    : IRequestHandler<GetVaccinationRecordByIdQuery, Result<VaccinationRecordDto>>
{
    public async Task<Result<VaccinationRecordDto>> Handle(GetVaccinationRecordByIdQuery request, CancellationToken cancellationToken)
    {
        var record = await repository.GetByIdAsync(request.Id);

        if (record == null)
        {
            return Result<VaccinationRecordDto>.Failure("Vaccination record not found");
        }

        var dto = mapper.Map<VaccinationRecordDto>(record);
        return Result<VaccinationRecordDto>.Success(dto);
    }
}
