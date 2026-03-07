using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;
namespace BabyCareAssistant.Infrastructure.Repositories;

public class GrowthLogStrategy : ILogSourceStrategy
{
    public LogType LogType => LogType.Growth;

    public Task<IEnumerable<LogEntryDto>> GetLogsAsync(
        string babyId, DateTime cursorTime, int count, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Task: Log Aggregation to be implemented for DynamoDB.");
    }
}
