using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;

public record UpdateBabyCommand(string Id, UpdateBabyDto Dto) : IRequest<Result<BabyDto>>;

internal sealed class UpdateBabyCommandHandler(IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<UpdateBabyCommand, Result<BabyDto>>
{
    public async Task<Result<BabyDto>> Handle(UpdateBabyCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.Dto.Id)
        {
            return Result<BabyDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var entity = mapper.Map<Domain.Entities.Baby>(request.Dto);
        var updatedEntity = await babyRepository.UpdateAsync(request.Id, entity, cancellationToken);

        if (updatedEntity == null)
        {
            return Result<BabyDto>.Failure("Baby not found");
        }

        var dto = mapper.Map<BabyDto>(updatedEntity);
        return Result<BabyDto>.Success(dto);
    }
}
