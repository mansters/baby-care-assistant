using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.ExcretionLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands;

public record CreateExcretionLogCommand(CreateExcretionLogDto Dto) : IRequest<Result<ExcretionLogDto>>;

public class CreateExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository, IMapper mapper)
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
