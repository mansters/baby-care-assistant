using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class ExcretionLogRepository(IDynamoDbBaseRepository<ExcretionLog> dynamoDbBaseRepository) : IExcretionLogRepository
{
    public async Task<List<ExcretionLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetListAsync($"BABY#{babyId}", "LOG#EXCR#", false, limit, cursorSk, ct);
    }

    public async Task<List<ExcretionLog>> GetListBeforeAsync(string babyId, DateTime maxTime, int limit, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetListBeforeAsync($"BABY#{babyId}", "LOG#EXCR#", maxTime, limit, ct);
    }

    public async Task<ExcretionLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetByKeyAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<ExcretionLog> CreateAsync(ExcretionLog excretionLog, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.CreateAsync(excretionLog, ct);
    }

    public async Task<ExcretionLog?> UpdateAsync(string babyId, string sk, ExcretionLog item, CancellationToken ct)
    {
        var mutate = (ExcretionLog log) =>
        {
            log.Type = item.Type;
            log.Notes = item.Notes;
            log.UpdatedAt = DateTime.UtcNow;
        };
        
        return await dynamoDbBaseRepository.UpdateAsync($"BABY#{babyId}", sk, mutate, ct);
    }
    
    public async Task<bool> DeleteAsync(string babyId, string sk, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.DeleteAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<ExcretionLog?> GetLatestAsync(string babyId, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetLatestAsync($"BABY#{babyId}", "LOG#EXCR#", ct);
    }
}
