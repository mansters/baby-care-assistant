using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Queries;

public record GetAllBabiesQuery : IRequest<Result<List<BabyDto>>>;

public class GetAllBabiesQueryHandler(IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<GetAllBabiesQuery, Result<List<BabyDto>>>
{
    public async Task<Result<List<BabyDto>>> Handle(GetAllBabiesQuery request, CancellationToken cancellationToken)
    {
        var babies = await babyRepository.GetAllAsync();
        var dtos = mapper.Map<List<BabyDto>>(babies);
        return Result<List<BabyDto>>.Success(dtos);
    }
}
