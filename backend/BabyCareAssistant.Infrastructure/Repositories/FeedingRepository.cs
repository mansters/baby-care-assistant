using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class FeedingRepository(IDynamoDbBaseRepository<FeedingLog> dynamoDbBaseRepository) : IFeedingRepository
{

    public async Task<List<FeedingLog>> GetListByBabyIdAsync(string babyId, string? cursorSk, int limit, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetListAsync($"BABY#{babyId}", "LOG#", false, limit, cursorSk, ct, "FeedingLog");
    }

    public async Task<List<FeedingLog>> GetListBeforeAsync(string babyId, DateTime maxTime, int limit, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetListBeforeAsync($"BABY#{babyId}", "LOG#", maxTime, limit, ct, "FeedingLog");
    }

    public async Task<FeedingLog?> GetByKeyAsync(string babyId, string sk, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetByKeyAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<FeedingLog> CreateAsync(FeedingLog log, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.CreateAsync(log, ct);
    }

    public async Task<FeedingLog?> UpdateAsync(string babyId, string sk, FeedingLog item, CancellationToken ct)
    {
        var mutate = (FeedingLog log) =>
        {
            log.EventTimeUtc = item.EventTimeUtc;
            log.SK = item.SK;
            log.LocalDate = item.LocalDate;
            log.LocalTime = item.LocalTime;
            log.AmountMl = item.AmountMl;
            log.LeftBreastDurationMinutes = item.LeftBreastDurationMinutes;
            log.RightBreastDurationMinutes = item.RightBreastDurationMinutes;
            log.Note = item.Note;
            log.UpdatedAt = DateTime.UtcNow;
        };
        
        return await dynamoDbBaseRepository.UpdateAsync($"BABY#{babyId}", sk, mutate, ct);
    }
    
    public async Task<bool> DeleteAsync(string babyId, string sk, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.DeleteAsync($"BABY#{babyId}", sk, ct);
    }

    public async Task<Dictionary<string, DailyFeedingInfo>> GetDailyFormulaTotalsAsync(string babyId, CancellationToken ct)
    {
        var allLogs = await dynamoDbBaseRepository.GetListAsync($"BABY#{babyId}", "LOG#", false, int.MaxValue, null, ct, "FeedingLog");

        var dailyTotals = new Dictionary<string, DailyFeedingInfo>();

        foreach (var log in allLogs)
        {
            var date = log.LocalDate;

            if (log.Type == BabyCareAssistant.Domain.Enums.FeedingType.Bottle)
            {
                if (!dailyTotals.ContainsKey(date))
                {
                    dailyTotals[date] = new DailyFeedingInfo(log.AmountMl, 1);
                }
                else
                {
                    var current = dailyTotals[date];
                    
                    dailyTotals[date] = current with 
                    { 
                        TotalMl = current.TotalMl + log.AmountMl,
                        FeedCount = current.FeedCount + 1
                    };
                }
            }
        }

        return dailyTotals;
    }


    public async Task<FeedingLog?> GetLatestAsync(string babyId, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetLatestAsync($"BABY#{babyId}", "LOG#", ct, "FeedingLog");
    }
}