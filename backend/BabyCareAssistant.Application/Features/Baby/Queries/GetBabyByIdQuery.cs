using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Queries;

public record GetBabyByIdQuery(Guid Id) : IRequest<Result<BabyDto>>;

public class GetBabyByIdQueryHandler(IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<GetBabyByIdQuery, Result<BabyDto>>
{
    public async Task<Result<BabyDto>> Handle(GetBabyByIdQuery request, CancellationToken cancellationToken)
    {
        var baby = await babyRepository.GetByIdAsync(request.Id);

        if (baby == null)
        {
            return Result<BabyDto>.Failure("Baby not found");
        }

        var dto = mapper.Map<BabyDto>(baby);
        return Result<BabyDto>.Success(dto);
    }
}
