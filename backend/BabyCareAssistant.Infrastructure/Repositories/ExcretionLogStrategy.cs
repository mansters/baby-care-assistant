using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class ExcretionLogStrategy(IExcretionLogRepository repository) : ILogSourceStrategy
{
    public LogType LogType => LogType.Diaper;

    public async Task<IEnumerable<LogEntryDto>> GetLogsAsync(
        string babyId, DateTime cursorTime, int count, CancellationToken cancellationToken = default)
    {
        var logs = await repository.GetListBeforeAsync(babyId, cursorTime, count, cancellationToken);
        
        return logs.Select(log => new LogEntryDto
        {
            Id = log.SK,
            StartTime = log.EventTimeUtc,
            Type = LogType.Diaper,
            Note = log.Notes,
            Details = new ExcretionLogDto
            {
                BabyId = log.BabyId,
                SK = log.SK,
                EventTimeUtc = log.EventTimeUtc,
                LocalDate = log.LocalDate,
                LocalTime = log.LocalTime,
                Type = log.Type,
                Notes = log.Notes
            }
        });
    }
}
