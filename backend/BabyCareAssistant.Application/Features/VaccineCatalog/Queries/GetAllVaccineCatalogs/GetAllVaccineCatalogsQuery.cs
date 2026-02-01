using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.VaccineCatalog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Queries.GetAllVaccineCatalogs;

public record GetAllVaccineCatalogsQuery : IRequest<Result<List<VaccineCatalogDto>>>;

internal sealed class GetAllVaccineCatalogsQueryHandler(IVaccineCatalogRepository repository, IMapper mapper)
    : IRequestHandler<GetAllVaccineCatalogsQuery, Result<List<VaccineCatalogDto>>>
{
    public async Task<Result<List<VaccineCatalogDto>>> Handle(GetAllVaccineCatalogsQuery request, CancellationToken cancellationToken)
    {
        var catalogs = await repository.GetAllAsync();
        var dtos = mapper.Map<List<VaccineCatalogDto>>(catalogs);
        return Result<List<VaccineCatalogDto>>.Success(dtos);
    }
}
