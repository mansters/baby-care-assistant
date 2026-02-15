using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class LogRepository(IEnumerable<ILogSourceStrategy> strategies) : ILogRepository
{
    public async Task<PaginatedLogResponse> GetLogsAsync(
        Guid babyId, string? cursor, int pageSize, LogType[]? types,
        CancellationToken cancellationToken = default)
    {
        var cursorTime = DecodeCursorTime(cursor);

        var activeStrategies = types is { Length: > 0 }
            ? strategies.Where(s => types.Contains(s.LogType))
            : strategies;

        var tasks = activeStrategies
            .Select(s => s.GetLogsAsync(babyId, cursorTime, pageSize, cancellationToken));
        var results = await Task.WhenAll(tasks);

        var page = results
            .SelectMany(r => r)
            .OrderByDescending(x => x.StartTime)
            .Take(pageSize)
            .ToList();

        var nextCursor = page.Count < pageSize
            ? null
            : EncodeCursor(page.Last());

        return new PaginatedLogResponse { Items = page, NextCursor = nextCursor };
    }

    private static DateTime DecodeCursorTime(string? cursor)
    {
        if (string.IsNullOrEmpty(cursor))
            return DateTime.MaxValue;

        try
        {
            var decoded = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(cursor));
            var parts = decoded.Split('_');
            return new DateTime(long.Parse(parts[0]), DateTimeKind.Utc);
        }
        catch
        {
            return DateTime.MaxValue;
        }
    }

    private static string EncodeCursor(LogEntryDto lastItem)
    {
        var raw = $"{lastItem.StartTime.Ticks}_{lastItem.Id}";
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(raw));
    }
}
