using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Services;

public class LogAggregationService(ILogQueryRepository logQueryRepository) : ILogAggregationService
{
    public Task<PaginatedLogResponse> GetLogsAsync(
        string babyId, string? cursor, int pageSize, LogType[]? types,
        CancellationToken cancellationToken = default)
    {
        return logQueryRepository.QueryLogsAsync(babyId, cursor, pageSize, types, cancellationToken);
    }
}
