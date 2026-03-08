using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Interfaces;

public interface ILogQueryRepository
{
    Task<PaginatedLogResponse> QueryLogsAsync(
        string babyId, string? cursor, int pageSize, LogType[]? types,
        CancellationToken cancellationToken = default);
}
