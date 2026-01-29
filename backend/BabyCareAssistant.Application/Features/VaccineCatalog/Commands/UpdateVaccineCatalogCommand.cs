using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccineCatalog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Commands;

public record UpdateVaccineCatalogCommand(Guid Id, UpdateVaccineCatalogDto Dto) : IRequest<Result<VaccineCatalogDto>>;

public class UpdateVaccineCatalogCommandHandler(IVaccineCatalogRepository repository, IMapper mapper)
    : IRequestHandler<UpdateVaccineCatalogCommand, Result<VaccineCatalogDto>>
{
    public async Task<Result<VaccineCatalogDto>> Handle(UpdateVaccineCatalogCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.Dto.Id)
        {
            return Result<VaccineCatalogDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var entity = mapper.Map<Domain.Entities.VaccineCatalog>(request.Dto);
        var updatedEntity = await repository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return Result<VaccineCatalogDto>.Failure("Vaccine catalog not found");
        }

        var dto = mapper.Map<VaccineCatalogDto>(updatedEntity);
        return Result<VaccineCatalogDto>.Success(dto);
    }
}
