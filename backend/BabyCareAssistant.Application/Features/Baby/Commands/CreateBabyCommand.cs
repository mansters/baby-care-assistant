using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Commands;

public record CreateBabyCommand(CreateBabyDto Dto) : IRequest<Result<BabyDto>>;

public class CreateBabyCommandHandler(IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<CreateBabyCommand, Result<BabyDto>>
{
    public async Task<Result<BabyDto>> Handle(CreateBabyCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<Domain.Entities.Baby>(request.Dto);
        entity = await babyRepository.CreateAsync(entity);

        var dto = mapper.Map<BabyDto>(entity);
        return Result<BabyDto>.Success(dto);
    }
}
