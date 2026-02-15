using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Domain.Enums;
using MediatR;

namespace BabyCareAssistant.Application.Features.Log.Queries.GetLogs;

public record GetLogsQuery(
    Guid BabyId,
    string? Cursor,
    int PageSize = 20,
    LogType[]? Types = null
) : IRequest<Result<PaginatedLogResponse>>;

internal sealed class GetLogsQueryHandler(LogAggregationService aggregationService)
    : IRequestHandler<GetLogsQuery, Result<PaginatedLogResponse>>
{
    public async Task<Result<PaginatedLogResponse>> Handle(
        GetLogsQuery request, CancellationToken cancellationToken)
    {
        var response = await aggregationService.GetLogsAsync(
            request.BabyId,
            request.Cursor,
            request.PageSize,
            request.Types,
            cancellationToken);

        return Result<PaginatedLogResponse>.Success(response);
    }
}
