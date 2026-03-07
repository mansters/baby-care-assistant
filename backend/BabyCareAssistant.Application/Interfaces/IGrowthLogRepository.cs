using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IGrowthLogRepository
{
    Task<List<GrowthLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct);
    Task<GrowthLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct);
    Task<GrowthLog> CreateAsync(GrowthLog growthLog, CancellationToken ct);
    Task<GrowthLog?> UpdateAsync(string babyId, string sk, GrowthLog item, CancellationToken ct);
    Task<bool> DeleteAsync(string babyId, string sk, CancellationToken ct);
    Task<GrowthLog?> GetLatestAsync(string babyId, CancellationToken ct);
}
