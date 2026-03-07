using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Queries.GetBabiesByFamilyId;

public record GetBabiesByFamilyIdQuery(string FamilyId) : IRequest<Result<List<BabyDto>>>;

internal sealed class GetBabiesByFamilyIdQueryHandler(IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<GetBabiesByFamilyIdQuery, Result<List<BabyDto>>>
{
    public async Task<Result<List<BabyDto>>> Handle(GetBabiesByFamilyIdQuery request, CancellationToken cancellationToken)
    {
        var babies = await babyRepository.GetByFamilyIdAsync(request.FamilyId, cancellationToken);
        var dtos = mapper.Map<List<BabyDto>>(babies);
        return Result<List<BabyDto>>.Success(dtos);
    }
}
