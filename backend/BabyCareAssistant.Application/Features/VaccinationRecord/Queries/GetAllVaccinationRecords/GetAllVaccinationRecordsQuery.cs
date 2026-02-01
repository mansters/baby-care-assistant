using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.VaccinationRecord.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Queries.GetAllVaccinationRecords;

public record GetAllVaccinationRecordsQuery : IRequest<Result<List<VaccinationRecordDto>>>;

internal sealed class GetAllVaccinationRecordsQueryHandler(IVaccinationRecordRepository repository, IMapper mapper)
    : IRequestHandler<GetAllVaccinationRecordsQuery, Result<List<VaccinationRecordDto>>>
{
    public async Task<Result<List<VaccinationRecordDto>>> Handle(GetAllVaccinationRecordsQuery request, CancellationToken cancellationToken)
    {
        var records = await repository.GetAllAsync();
        var dtos = mapper.Map<List<VaccinationRecordDto>>(records);
        return Result<List<VaccinationRecordDto>>.Success(dtos);
    }
}
