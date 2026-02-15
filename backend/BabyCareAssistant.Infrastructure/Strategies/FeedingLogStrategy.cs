using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Strategies;

public class FeedingLogStrategy(BabyCareAssistantDbContext context) : ILogSourceStrategy
{
    public LogType LogType => LogType.Feeding;

    public async Task<IEnumerable<LogEntryDto>> GetLogsAsync(
        Guid babyId, DateTime cursorTime, int count, CancellationToken cancellationToken = default)
    {
        var feedingLogs = await context.FeedingLogs
            .AsNoTracking()
            .Where(f => f.BabyId == babyId && f.FeedingTime < cursorTime)
            .OrderByDescending(f => f.FeedingTime)
            .Take(count)
            .ToListAsync(cancellationToken);

        return feedingLogs.Select(f => new LogEntryDto
        {
            Id = f.Id,
            StartTime = f.FeedingTime,
            Type = LogType.Feeding,
            Note = f.Note,
            Details = new FeedingDetailsDto
            {
                FeedingType = f.Type.ToString(),
                LeftBreastDurationMinutes = f.LeftBreastDurationMinutes,
                RightBreastDurationMinutes = f.RightBreastDurationMinutes,
                AmountMl = f.AmountMl
            }
        });
    }
}
