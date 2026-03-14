using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;

public record UpdateBabyCommand(string Id, UpdateBabyDto Dto) ;

public sealed class UpdateBabyCommandHandler(IBabyRepository babyRepository)
{
    public async Task<Result<BabyDto>> Handle(UpdateBabyCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.Dto.Id)
        {
            return Result<BabyDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var entity = new Domain.Entities.Baby();
        request.Dto.UpdateEntity(entity);
        var updatedEntity = await babyRepository.UpdateAsync(request.Id, entity, cancellationToken);

        if (updatedEntity == null)
        {
            return Result<BabyDto>.Failure("Baby not found");
        }

        var dto = updatedEntity.ToDto();
        return Result<BabyDto>.Success(dto);
    }
}
