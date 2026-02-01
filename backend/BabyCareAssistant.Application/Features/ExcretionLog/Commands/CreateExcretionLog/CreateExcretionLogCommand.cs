using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;

public record CreateExcretionLogCommand(CreateExcretionLogDto Dto) : IRequest<Result<ExcretionLogDto>>;

internal sealed class CreateExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository, IMapper mapper)
    : IRequestHandler<CreateExcretionLogCommand, Result<ExcretionLogDto>>
{
    public async Task<Result<ExcretionLogDto>> Handle(CreateExcretionLogCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<Domain.Entities.ExcretionLog>(request.Dto);
        entity = await excretionLogRepository.CreateAsync(entity);

        var dto = mapper.Map<ExcretionLogDto>(entity);
        return Result<ExcretionLogDto>.Success(dto);
    }
}
