using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IExcretionLogRepository
{
    Task<List<ExcretionLog>> GetAllAsync();
    Task<ExcretionLog?> GetByIdAsync(Guid id);
    Task<ExcretionLog> CreateAsync(ExcretionLog excretionLog);
    Task<ExcretionLog?> UpdateAsync(ExcretionLog excretionLog);
    Task<bool> DeleteAsync(Guid id);
}
