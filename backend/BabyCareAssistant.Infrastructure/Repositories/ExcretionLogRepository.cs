using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class ExcretionLogRepository(BabyCareAssistantDbContext dbContext) : IExcretionLogRepository
{
    public async Task<List<ExcretionLog>> GetAllAsync()
    {
        return await dbContext.ExcretionLogs.ToListAsync();
    }

    public async Task<ExcretionLog?> GetByIdAsync(Guid id)
    {
        return await dbContext.ExcretionLogs.FindAsync(id);
    }

    public async Task<ExcretionLog> CreateAsync(ExcretionLog excretionLog)
    {
        await dbContext.ExcretionLogs.AddAsync(excretionLog);
        await dbContext.SaveChangesAsync();
        return excretionLog;
    }

    public async Task<ExcretionLog?> UpdateAsync(ExcretionLog excretionLog)
    {
        var existingLog = await dbContext.ExcretionLogs.FindAsync(excretionLog.Id);

        if (existingLog == null)
        {
            return null;
        }
        
        existingLog.Time = excretionLog.Time;
        existingLog.Type = excretionLog.Type;
        existingLog.Notes = excretionLog.Notes;
        
        await dbContext.SaveChangesAsync();

        return existingLog;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingLog = await dbContext.ExcretionLogs.FindAsync(id);

        if (existingLog == null)
        {
            return false;
        }

        dbContext.ExcretionLogs.Remove(existingLog);
        await dbContext.SaveChangesAsync();
        
        return true;
    }
}
