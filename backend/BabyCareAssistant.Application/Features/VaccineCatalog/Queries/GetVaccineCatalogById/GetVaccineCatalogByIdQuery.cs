using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.VaccineCatalog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Queries.GetVaccineCatalogById;

public record GetVaccineCatalogByIdQuery(Guid Id) : IRequest<Result<VaccineCatalogDto>>;

internal sealed class GetVaccineCatalogByIdQueryHandler(IVaccineCatalogRepository repository, IMapper mapper)
    : IRequestHandler<GetVaccineCatalogByIdQuery, Result<VaccineCatalogDto>>
{
    public async Task<Result<VaccineCatalogDto>> Handle(GetVaccineCatalogByIdQuery request, CancellationToken cancellationToken)
    {
        var catalog = await repository.GetByIdAsync(request.Id);

        if (catalog == null)
        {
            return Result<VaccineCatalogDto>.Failure("Vaccine catalog not found");
        }

        var dto = mapper.Map<VaccineCatalogDto>(catalog);
        return Result<VaccineCatalogDto>.Success(dto);
    }
}
