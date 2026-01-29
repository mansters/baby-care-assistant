using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccineCatalog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Commands;

public record CreateVaccineCatalogCommand(CreateVaccineCatalogDto Dto) : IRequest<Result<VaccineCatalogDto>>;

public class CreateVaccineCatalogCommandHandler(IVaccineCatalogRepository repository, IMapper mapper)
    : IRequestHandler<CreateVaccineCatalogCommand, Result<VaccineCatalogDto>>
{
    public async Task<Result<VaccineCatalogDto>> Handle(CreateVaccineCatalogCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<Domain.Entities.VaccineCatalog>(request.Dto);
        entity = await repository.CreateAsync(entity);

        var dto = mapper.Map<VaccineCatalogDto>(entity);
        return Result<VaccineCatalogDto>.Success(dto);
    }
}
