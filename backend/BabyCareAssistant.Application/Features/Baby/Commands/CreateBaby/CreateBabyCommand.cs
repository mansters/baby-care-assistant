using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;

public record CreateBabyCommand(CreateBabyDto Dto) ;

public sealed class CreateBabyCommandHandler(IBabyRepository babyRepository)
{
    public async Task<Result<BabyDto>> Handle(CreateBabyCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Dto.ToEntity();
        entity.BabyId = Guid.NewGuid().ToString();
        entity = await babyRepository.CreateAsync(entity, cancellationToken);

        var dto = entity.ToDto();
        return Result<BabyDto>.Success(dto);
    }
}
