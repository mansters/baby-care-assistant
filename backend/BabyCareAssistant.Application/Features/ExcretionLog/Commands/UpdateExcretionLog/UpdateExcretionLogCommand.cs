using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;

public record UpdateExcretionLogCommand(Guid Id, UpdateExcretionLogDto Dto) : IRequest<Result<ExcretionLogDto>>;

internal sealed class UpdateExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository, IMapper mapper)
    : IRequestHandler<UpdateExcretionLogCommand, Result<ExcretionLogDto>>
{
    public async Task<Result<ExcretionLogDto>> Handle(UpdateExcretionLogCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.Dto.Id)
        {
            return Result<ExcretionLogDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var entity = mapper.Map<Domain.Entities.ExcretionLog>(request.Dto);
        var updatedEntity = await excretionLogRepository.UpdateAsync(entity);

        if (updatedEntity == null)
        {
            return Result<ExcretionLogDto>.Failure("Excretion log not found");
        }

        var dto = mapper.Map<ExcretionLogDto>(updatedEntity);
        return Result<ExcretionLogDto>.Success(dto);
    }
}
