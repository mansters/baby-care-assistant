using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
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
}