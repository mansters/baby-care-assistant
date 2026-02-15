using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;
using MediatR;

namespace BabyCareAssistant.Application.Features.Log.Queries.GetLogs;

public record GetLogsQuery(
    Guid BabyId,
    string? Cursor,
    int PageSize,
    LogType[]? Types) : IRequest<Result<PaginatedLogResponse>>;

internal sealed class GetLogsQueryHandler(ILogRepository logRepository)
    : IRequestHandler<GetLogsQuery, Result<PaginatedLogResponse>>
{
    public async Task<Result<PaginatedLogResponse>> Handle(
        GetLogsQuery request, CancellationToken cancellationToken)
    {
        var result = await logRepository.GetLogsAsync(
            request.BabyId, request.Cursor, request.PageSize, request.Types, cancellationToken);
        return Result<PaginatedLogResponse>.Success(result);
    }
}
