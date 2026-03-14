using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.Baby.Queries.GetBabiesByFamilyId;

public record GetBabiesByFamilyIdQuery(string FamilyId) : IRequest<Result<List<BabyDto>>>;

internal sealed class GetBabiesByFamilyIdQueryHandler(IBabyRepository babyRepository)
    : IRequestHandler<GetBabiesByFamilyIdQuery, Result<List<BabyDto>>>
{
    public async Task<Result<List<BabyDto>>> Handle(GetBabiesByFamilyIdQuery request, CancellationToken cancellationToken)
    {
        var babies = await babyRepository.GetByFamilyIdAsync(request.FamilyId, cancellationToken);
        var dtos = babies.Select(b => b.ToDto()).ToList();
        return Result<List<BabyDto>>.Success(dtos);
    }
}
