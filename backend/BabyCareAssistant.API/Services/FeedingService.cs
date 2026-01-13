using BabyCareAssistant.Domain.Entities.Feeding;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.API.Services;

public class FeedingService: IFeedingService
{
    private readonly BabyCareAssistantDbContext _context;

    public FeedingService(BabyCareAssistantDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<FeedingLog>> GetAllAsync()
    {
        return await _context.FeedingLogs.ToListAsync();
    }

    public async Task<FeedingLog?> GetAsync(Guid id)
    {
        return await _context.FeedingLogs.FindAsync(id);
    }

    public async Task AddAsync(FeedingLog log)
    {
        _context.FeedingLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(FeedingLog log)
    {
        _context.FeedingLogs.Update(log);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        await _context.FeedingLogs
            .Where(f => f.Id == id)
            .ExecuteDeleteAsync();
    }
}