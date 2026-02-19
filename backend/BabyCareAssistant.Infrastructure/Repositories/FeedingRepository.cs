using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Domain.Enums;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class FeedingRepository(BabyCareAssistantDbContext context) : IFeedingRepository
{
    public async Task<List<FeedingLog>> GetAllAsync()
    {
        return await context.FeedingLogs.ToListAsync();
    }

    public async Task<FeedingLog?> GetByIdAsync(Guid id)
    {
        return await context.FeedingLogs.FindAsync(id);
    }

    public async Task<FeedingLog> CreateAsync(FeedingLog log)
    {
        await context.FeedingLogs.AddAsync(log);
        await context.SaveChangesAsync();
        return log;
    }

    public async Task<FeedingLog?> UpdateAsync(FeedingLog log)
    {
        var existingLog = await context.FeedingLogs.FindAsync(log.Id);

        if (existingLog == null)
        {
            return null;
        }
        
        existingLog.FeedingTime = log.FeedingTime;

        existingLog.Type = log.Type;
        existingLog.AmountMl = log.AmountMl;
        
        await context.SaveChangesAsync();
        return existingLog;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingLog = await context.FeedingLogs.FindAsync(id);

        if (existingLog == null)
        {
            return false;
        }

        context.FeedingLogs.Remove(existingLog);
        await context.SaveChangesAsync();
        
        return true;
    }

    public async Task<Dictionary<string, DailyFeedingInfo>> GetDailyFormulaTotalsAsync(
        Guid babyId, string timeZoneId, CancellationToken cancellationToken = default)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);

        var feedingLogs = await context.FeedingLogs
            .AsNoTracking()
            .Where(f => f.BabyId == babyId && f.AmountMl > 0 && f.Type == FeedingType.Bottle)
            .ToListAsync(cancellationToken);

        return feedingLogs
            .GroupBy(f => TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(f.FeedingTime, DateTimeKind.Utc), timeZone).Date)
            .ToDictionary(
                g => g.Key.ToString("yyyy-MM-dd"),
                g => new DailyFeedingInfo(g.Sum(f => f.AmountMl), g.Count()));
    }
}