using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IExcretionLogRepository
{
    Task<List<ExcretionLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct);
    Task<List<ExcretionLog>> GetListBeforeAsync(string babyId, DateTime maxTime, int limit, CancellationToken ct);
    Task<ExcretionLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct);
    Task<ExcretionLog> CreateAsync(ExcretionLog excretionLog, CancellationToken ct);
    Task<ExcretionLog?> UpdateAsync(string babyId, string sk, ExcretionLog item, CancellationToken ct);
    Task<bool> DeleteAsync(string babyId, string sk, CancellationToken ct);
    Task<ExcretionLog?> GetLatestAsync(string babyId, CancellationToken ct);
}
