using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.Baby.Queries.GetBabyById;

public record GetBabyByIdQuery(string Id) : IRequest<Result<BabyDto>>;

internal sealed class GetBabyByIdQueryHandler(IBabyRepository babyRepository)
    : IRequestHandler<GetBabyByIdQuery, Result<BabyDto>>
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
