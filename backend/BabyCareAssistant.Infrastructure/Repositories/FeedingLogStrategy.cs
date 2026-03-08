using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;
namespace BabyCareAssistant.Infrastructure.Repositories;

public class FeedingLogStrategy(IFeedingRepository repository) : ILogSourceStrategy
{
    public LogType LogType => LogType.Feeding;

    public async Task<IEnumerable<LogEntryDto>> GetLogsAsync(
        string babyId, DateTime cursorTime, int count, CancellationToken cancellationToken = default)
    {
        var logs = await repository.GetListBeforeAsync(babyId, cursorTime, count, cancellationToken);
        
        return logs.Select(log => new LogEntryDto
        {
            Id = log.SK,
            StartTime = log.EventTimeUtc,
            Type = LogType.Feeding,
            Note = log.Note,
            Details = new FeedingLogDto
            {
                BabyId = log.BabyId,
                SK = log.SK,
                EventTimeUtc = log.EventTimeUtc,
                LocalDate = log.LocalDate,
                LocalTime = log.LocalTime,
                Type = log.Type,
                AmountMl = log.AmountMl,
                LeftBreastDurationMinutes = log.LeftBreastDurationMinutes,
                RightBreastDurationMinutes = log.RightBreastDurationMinutes,
                Note = log.Note
            }
        });
    }
}
