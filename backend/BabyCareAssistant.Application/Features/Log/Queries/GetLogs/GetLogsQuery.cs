using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.Log.Queries.GetLogs;

public record GetLogsQuery(
    string BabyId,
    string? Cursor,
    int PageSize,
    LogType[]? Types) ;

public sealed class GetLogsQueryHandler(ILogAggregationService logAggregationService)
{
    public async Task<Result<PaginatedLogResponse>> Handle(
        GetLogsQuery request, CancellationToken cancellationToken)
    {
        var result = await logAggregationService.GetLogsAsync(
            request.BabyId, request.Cursor, request.PageSize, request.Types, cancellationToken);
        return Result<PaginatedLogResponse>.Success(result);
    }
}
