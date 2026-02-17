using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class GrowthLogStrategy(BabyCareAssistantDbContext context) : ILogSourceStrategy
{
    public LogType LogType => LogType.Growth;

    public async Task<IEnumerable<LogEntryDto>> GetLogsAsync(
        Guid babyId, DateTime cursorTime, int count, CancellationToken cancellationToken = default)
    {
        var growthLogs = await context.GrowthLogs
            .AsNoTracking()
            .Where(g => g.BabyId == babyId && g.DateMeasured < cursorTime)
            .OrderByDescending(g => g.DateMeasured)
            .Take(count)
            .ToListAsync(cancellationToken);

        return growthLogs.Select(g => new LogEntryDto
        {
            Id = g.Id,
            StartTime = g.DateMeasured,
            Type = LogType.Growth,
            Note = g.Note,
            Details = new GrowthDetailsDto
            {
                WeightKg = g.WeightKg,
                HeightCm = g.HeightCm,
                HeadCircumferenceCm = g.HeadCircumferenceCm
            }
        });
    }
}
