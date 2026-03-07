using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;

public record CreateBabyCommand(CreateBabyDto Dto) : IRequest<Result<BabyDto>>;

internal sealed class CreateBabyCommandHandler(IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<CreateBabyCommand, Result<BabyDto>>
{
    public async Task<Result<BabyDto>> Handle(CreateBabyCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<Domain.Entities.Baby>(request.Dto);
        entity.BabyId = Guid.NewGuid().ToString();
        entity = await babyRepository.CreateAsync(entity, cancellationToken);

        var dto = mapper.Map<BabyDto>(entity);
        return Result<BabyDto>.Success(dto);
    }
}
