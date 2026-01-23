using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class GrowthLogRepository(BabyCareAssistantDbContext dbContext) : IGrowthLogRepository
{
    public async Task<List<GrowthLog>> GetAllAsync()
    {
        return await dbContext.GrowthLogs.ToListAsync();
    }

    public async Task<GrowthLog?> GetByIdAsync(Guid id)
    {
        return await dbContext.GrowthLogs.FindAsync(id);
    }

    public async Task<GrowthLog> CreateAsync(GrowthLog growthLog)
    {
        await dbContext.GrowthLogs.AddAsync(growthLog);
        await dbContext.SaveChangesAsync();
        return growthLog;
    }

    public async Task<GrowthLog?> UpdateAsync(GrowthLog growthLog)
    {
        var existingGrowthLog = await dbContext.GrowthLogs.FindAsync(growthLog.Id);

        if (existingGrowthLog == null)
        {
            return null;
        } 
        
        existingGrowthLog.DateMeasured = growthLog.DateMeasured;
        existingGrowthLog.WeightKg = growthLog.WeightKg;
        existingGrowthLog.HeightCm = growthLog.HeightCm;
        existingGrowthLog.HeadCircumferenceCm = growthLog.HeadCircumferenceCm;
        
        await dbContext.SaveChangesAsync();

        return existingGrowthLog;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingGrowthLog = await dbContext.GrowthLogs.FindAsync(id);

        if (existingGrowthLog == null)
        {
            return false;
        }

        dbContext.GrowthLogs.Remove(existingGrowthLog);
        await dbContext.SaveChangesAsync();
        
        return true;
    }
}