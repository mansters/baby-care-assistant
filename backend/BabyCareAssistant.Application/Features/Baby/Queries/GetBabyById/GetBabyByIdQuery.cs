using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.Baby.Queries.GetBabyById;

public record GetBabyByIdQuery(string Id) ;

public sealed class GetBabyByIdQueryHandler(IBabyRepository babyRepository)
{
    public async Task<Result<BabyDto>> Handle(GetBabyByIdQuery request, CancellationToken cancellationToken)
    {
        var baby = await babyRepository.GetByIdAsync(request.Id, cancellationToken);

        if (baby == null)
        {
            return Result<BabyDto>.Failure("Baby not found");
        }

        var dto = baby.ToDto();
        return Result<BabyDto>.Success(dto);
    }
}
