using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class GrowthLogRepository(IDynamoDbBaseRepository<GrowthLog> dynamoDbBaseRepository) : IGrowthLogRepository
{
    public async Task<List<GrowthLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetListAsync($"BABY#{babyId}", "LOG#", false, limit, cursorSk, ct, "GrowthLog");
    }

    public async Task<List<GrowthLog>> GetListBeforeAsync(string babyId, DateTime maxTime, int limit, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetListBeforeAsync($"BABY#{babyId}", "LOG#", maxTime, limit, ct, "GrowthLog");
    }

    public async Task<GrowthLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetByKeyAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<GrowthLog> CreateAsync(GrowthLog growthLog, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.CreateAsync(growthLog, ct);
    }

    public async Task<GrowthLog?> UpdateAsync(string babyId, string sk, Action<GrowthLog> mutate, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.UpdateAsync($"BABY#{babyId}", sk, mutate, ct);
    }
    
    public async Task DeleteAsync(string babyId, string sk, CancellationToken ct)
    {
        await dynamoDbBaseRepository.DeleteAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<GrowthLog?> GetLatestAsync(string babyId, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetLatestAsync($"BABY#{babyId}", "LOG#", ct, "GrowthLog");
    }
}
