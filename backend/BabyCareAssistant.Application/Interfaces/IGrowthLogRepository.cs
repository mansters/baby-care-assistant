using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IGrowthLogRepository
{
    Task<List<GrowthLog>> GetAllAsync();
    
    Task<GrowthLog?> GetByIdAsync(Guid id);
    
    Task<GrowthLog> CreateAsync(GrowthLog growthLog);

    Task<GrowthLog?> UpdateAsync(GrowthLog growthLog);
    
    Task<bool> DeleteAsync(Guid id);
}