using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccineCatalog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Queries;

public record GetAllVaccineCatalogsQuery : IRequest<Result<List<VaccineCatalogDto>>>;

public class GetAllVaccineCatalogsQueryHandler(IVaccineCatalogRepository repository, IMapper mapper)
    : IRequestHandler<GetAllVaccineCatalogsQuery, Result<List<VaccineCatalogDto>>>
{
    public async Task<Result<List<VaccineCatalogDto>>> Handle(GetAllVaccineCatalogsQuery request, CancellationToken cancellationToken)
    {
        var catalogs = await repository.GetAllAsync();
        var dtos = mapper.Map<List<VaccineCatalogDto>>(catalogs);
        return Result<List<VaccineCatalogDto>>.Success(dtos);
    }
}
