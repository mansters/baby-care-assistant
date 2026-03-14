using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;

public record UpdateExcretionLogCommand(string BabyId, string Sk, UpdateExcretionLogDto Dto) : IRequest<Result<ExcretionLogDto>>;

internal sealed class UpdateExcretionLogCommandHandler(IExcretionLogRepository excretionLogRepository)
    : IRequestHandler<UpdateExcretionLogCommand, Result<ExcretionLogDto>>
{
    public async Task<Result<ExcretionLogDto>> Handle(UpdateExcretionLogCommand request, CancellationToken cancellationToken)
    {
        if (request.BabyId != request.Dto.BabyId || request.Sk != request.Dto.SK)
        {
            return Result<ExcretionLogDto>.Failure("The ID in the URL does not match the ID in the request body.");
        }

        var existingLog = await excretionLogRepository.GetByKeyAsync(request.BabyId, request.Sk, cancellationToken);
        if (existingLog == null) return Result<ExcretionLogDto>.Failure("Excretion log not found");

        request.Dto.UpdateEntity(existingLog);
        var updatedLog = await excretionLogRepository.UpdateAsync(request.BabyId, request.Sk, existingLog, cancellationToken);

        if (updatedLog == null) return Result<ExcretionLogDto>.Failure("Excretion log not found");
        return Result<ExcretionLogDto>.Success(updatedLog.ToDto());
    }
}
