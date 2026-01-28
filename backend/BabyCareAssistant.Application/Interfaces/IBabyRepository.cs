using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IBabyRepository
{
    Task<List<Baby>> GetAllAsync();
    
    Task<Baby?> GetByIdAsync(Guid id);
    
    Task<Baby> CreateAsync(Baby baby);
    
    Task<Baby?> UpdateAsync(Baby baby);
    
    Task<bool> DeleteAsync(Guid id);
}