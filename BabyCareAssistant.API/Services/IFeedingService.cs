using BabyCareAssistant.Domain.Entities.Feeding;

namespace BabyCareAssistant.API.Services;

public interface IFeedingService
{
    Task<List<FeedingLog>> GetAllAsync();
    
    Task<FeedingLog?> GetAsync(Guid id);
    
    Task AddAsync(FeedingLog log);
    
    Task UpdateAsync(FeedingLog log);
    
    Task DeleteAsync(Guid id);
}