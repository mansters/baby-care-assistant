using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogsByBabyId;

public record GetExcretionLogsByBabyIdQuery(string BabyId, string? CursorSk, int Limit = 20) : IRequest<Result<List<ExcretionLogDto>>>;

internal sealed class GetExcretionLogsByBabyIdQueryHandler(IExcretionLogRepository excretionLogRepository)
    : IRequestHandler<GetExcretionLogsByBabyIdQuery, Result<List<ExcretionLogDto>>>
{
    public async Task<Result<List<ExcretionLogDto>>> Handle(GetExcretionLogsByBabyIdQuery request, CancellationToken cancellationToken)
    {
        var logs = await excretionLogRepository.GetListByBabyIdAsync(request.BabyId, request.CursorSk, request.Limit, cancellationToken);
        var dtos = logs.Select(l => l.ToDto()).ToList();
        return Result<List<ExcretionLogDto>>.Success(dtos);
    }
}
