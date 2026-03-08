using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IGrowthLogRepository
{
    Task<GrowthLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct);
    
    Task<List<GrowthLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct);
    Task<List<GrowthLog>> GetListBeforeAsync(string babyId, DateTime maxTime, int limit, CancellationToken ct);
    
    Task<GrowthLog> CreateAsync(GrowthLog log, CancellationToken ct);
    
    Task<GrowthLog?> UpdateAsync(string babyId, string sk, Action<GrowthLog> mutate, CancellationToken ct);
    
    Task DeleteAsync(string babyId, string sk, CancellationToken ct);
    
    Task<GrowthLog?> GetLatestAsync(string babyId, CancellationToken ct);
}