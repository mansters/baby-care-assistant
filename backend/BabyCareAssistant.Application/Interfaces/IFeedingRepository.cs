using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IFeedingRepository
{
    Task<List<FeedingLog>> GetAllAsync();
    
    Task<FeedingLog?> GetByIdAsync(Guid id);
    
    Task<FeedingLog> CreateAsync(FeedingLog log);
    
    Task<FeedingLog?> UpdateAsync(FeedingLog log);
    
    Task<bool> DeleteAsync(Guid id);
}