using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Interfaces;

public interface ILogAggregationService
{
    Task<PaginatedLogResponse> GetLogsAsync(
        Guid babyId, string? cursor, int pageSize, LogType[]? types,
        CancellationToken cancellationToken = default);
}
