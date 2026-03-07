using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogsByBabyId;

public record GetExcretionLogsByBabyIdQuery(string BabyId, string? CursorSk, int Limit = 20) : IRequest<Result<List<ExcretionLogDto>>>;

internal sealed class GetExcretionLogsByBabyIdQueryHandler(IExcretionLogRepository excretionLogRepository, IMapper mapper)
    : IRequestHandler<GetExcretionLogsByBabyIdQuery, Result<List<ExcretionLogDto>>>
{
    public async Task<Result<List<ExcretionLogDto>>> Handle(GetExcretionLogsByBabyIdQuery request, CancellationToken cancellationToken)
    {
        var logs = await excretionLogRepository.GetListByBabyIdAsync(request.BabyId, request.CursorSk, request.Limit, cancellationToken);
        var dtos = mapper.Map<List<ExcretionLogDto>>(logs);
        return Result<List<ExcretionLogDto>>.Success(dtos);
    }
}
