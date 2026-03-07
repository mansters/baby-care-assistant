using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;

public record CreateExcretionLogCommand(CreateExcretionLogDto Dto) : IRequest<Result<ExcretionLogDto>>;

internal sealed class CreateExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository, IBabyRepository babyRepository, IMapper mapper)
    : IRequestHandler<CreateExcretionLogCommand, Result<ExcretionLogDto>>
{
    public async Task<Result<ExcretionLogDto>> Handle(CreateExcretionLogCommand request, CancellationToken cancellationToken)
    {
        var baby = await babyRepository.GetByIdAsync(request.Dto.BabyId, cancellationToken);
        if (baby == null)
        {
            return Result<ExcretionLogDto>.Failure("Baby not found");
        }

        var entity = mapper.Map<Domain.Entities.ExcretionLog>(request.Dto);
        entity.Initialize(request.Dto.BabyId, request.Dto.LocalDateTime, baby.TimeZone);
        
        entity = await excretionLogRepository.CreateAsync(entity, cancellationToken);

        var dto = mapper.Map<ExcretionLogDto>(entity);
        return Result<ExcretionLogDto>.Success(dto);
    }
}
