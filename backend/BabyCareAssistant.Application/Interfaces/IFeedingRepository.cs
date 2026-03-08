using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IFeedingRepository
{
    Task<List<FeedingLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct);
    Task<List<FeedingLog>> GetListBeforeAsync(string babyId, DateTime maxTime, int limit, CancellationToken ct);
    
    Task<FeedingLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct);
    
    Task<FeedingLog> CreateAsync(FeedingLog log, CancellationToken ct);
    
    Task<FeedingLog?> UpdateAsync(string babyId, string sk, FeedingLog item, CancellationToken ct);
    
    Task<bool> DeleteAsync(string babyId, string sk, CancellationToken ct);
    
    Task<Dictionary<string, DailyFeedingInfo>> GetDailyFormulaTotalsAsync(string babyId, CancellationToken ct);
    
    Task<FeedingLog?> GetLatestAsync(string babyId, CancellationToken ct);
}