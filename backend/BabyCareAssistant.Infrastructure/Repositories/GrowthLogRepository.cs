using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class GrowthLogRepository(IDynamoDbBaseRepository<GrowthLog> dynamoDbBaseRepository) : IGrowthLogRepository
{
    public async Task<List<GrowthLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetListAsync($"BABY#{babyId}", "LOG#GROW#", false, limit, cursorSk, ct);
    }

    public async Task<GrowthLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetByKeyAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<GrowthLog> CreateAsync(GrowthLog growthLog, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.CreateAsync(growthLog, ct);
    }

    public async Task<GrowthLog?> UpdateAsync(string babyId, string sk, GrowthLog item, CancellationToken ct)
    {
        var mutate = (GrowthLog log) =>
        {
            log.WeightKg = item.WeightKg;
            log.HeightCm = item.HeightCm;
            log.HeadCircumferenceCm = item.HeadCircumferenceCm;
            log.Note = item.Note;
            log.UpdatedAt = DateTime.UtcNow;
        };
        
        return await dynamoDbBaseRepository.UpdateAsync($"BABY#{babyId}", sk, mutate, ct);
    }
    
    public async Task<bool> DeleteAsync(string babyId, string sk, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.DeleteAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<GrowthLog?> GetLatestAsync(string babyId, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetLatestAsync($"BABY#{babyId}", "LOG#GROW#", ct);
    }
}
