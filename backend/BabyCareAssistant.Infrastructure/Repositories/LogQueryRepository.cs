using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Enums;
using BabyCareAssistant.Infrastructure.Helpers;
using Microsoft.Extensions.Configuration;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class LogQueryRepository(IAmazonDynamoDB dynamoDb, IConfiguration config) : ILogQueryRepository
{
    private readonly string _tableName = config["DynamoDb:TableName"] ?? "BabyCareTable";

    private static readonly Dictionary<string, LogType> EntityTypeToLogType = new()
    {
        { "FeedingLog", LogType.Feeding },
        { "GrowthLog", LogType.Growth },
        { "ExcretionLog", LogType.Diaper }
    };

    private static readonly Dictionary<LogType, string> LogTypeToEntityType = new()
    {
        { LogType.Feeding, "FeedingLog" },
        { LogType.Growth, "GrowthLog" },
        { LogType.Diaper, "ExcretionLog" }
    };

    public async Task<PaginatedLogResponse> QueryLogsAsync(
        string babyId, string? cursor, int pageSize, LogType[]? types,
        CancellationToken cancellationToken = default)
    {
        var pk = $"BABY#{babyId}";

        var request = new QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk AND begins_with(SK, :skPrefix)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":pk", new AttributeValue { S = pk } },
                { ":skPrefix", new AttributeValue { S = "LOG#" } }
            },
            ScanIndexForward = false,
            Limit = pageSize
        };

        if (types is { Length: > 0 })
        {
            var entityTypes = types
                .Where(t => LogTypeToEntityType.ContainsKey(t))
                .Select(t => LogTypeToEntityType[t])
                .ToList();

            if (entityTypes.Count == 1)
            {
                request.FilterExpression = "EntityType = :entityType";
                request.ExpressionAttributeValues[":entityType"] = new AttributeValue { S = entityTypes[0] };
                request.Limit = pageSize * 5;
            }
            else if (entityTypes.Count > 1)
            {
                var conditions = new List<string>();
                for (var i = 0; i < entityTypes.Count; i++)
                {
                    var placeholder = $":et{i}";
                    conditions.Add($"EntityType = {placeholder}");
                    request.ExpressionAttributeValues[placeholder] = new AttributeValue { S = entityTypes[i] };
                }
                request.FilterExpression = $"({string.Join(" OR ", conditions)})";
                request.Limit = pageSize * 5;
            }
        }

        if (!string.IsNullOrEmpty(cursor))
        {
            request.ExclusiveStartKey = new Dictionary<string, AttributeValue>
            {
                { "PK", new AttributeValue { S = pk } },
                { "SK", new AttributeValue { S = cursor } }
            };
        }

        var response = await dynamoDb.QueryAsync(request, cancellationToken);

        var entries = new List<LogEntryDto>();
        foreach (var item in response.Items)
        {
            var mapped = MapItemToLogEntry(item);
            if (mapped != null)
                entries.Add(mapped);
        }

        var page = entries.Take(pageSize).ToList();

        string? nextCursor = null;
        if (page.Count >= pageSize)
        {
            nextCursor = page.Last().Id;
        }
        else if (response.LastEvaluatedKey?.Count > 0)
        {
            nextCursor = page.LastOrDefault()?.Id;
        }

        return new PaginatedLogResponse { Items = page, NextCursor = nextCursor };
    }

    private static LogEntryDto? MapItemToLogEntry(Dictionary<string, AttributeValue> item)
    {
        try
        {
            if (!item.TryGetValue("EntityType", out var entityTypeAttr))
                return null;

            var entityType = entityTypeAttr.S;
            if (!EntityTypeToLogType.TryGetValue(entityType, out var logType))
                return null;

            object? details = entityType switch
            {
                "FeedingLog" => DynamoDbMapper.ToEntity<Domain.Entities.FeedingLog>(item) is { } feedLog
                    ? new FeedingLogDto
                    {
                        BabyId = feedLog.BabyId,
                        SK = feedLog.SK,
                        EventTimeUtc = feedLog.EventTimeUtc,
                        LocalDate = feedLog.LocalDate,
                        LocalTime = feedLog.LocalTime,
                        Type = feedLog.Type,
                        AmountMl = feedLog.AmountMl,
                        LeftBreastDurationMinutes = feedLog.LeftBreastDurationMinutes,
                        RightBreastDurationMinutes = feedLog.RightBreastDurationMinutes,
                        Note = feedLog.Note
                    }
                    : null,
                "GrowthLog" => DynamoDbMapper.ToEntity<Domain.Entities.GrowthLog>(item) is { } growLog
                    ? new GrowthLogDto
                    {
                        BabyId = growLog.BabyId,
                        SK = growLog.SK,
                        EventTimeUtc = growLog.EventTimeUtc,
                        LocalDate = growLog.LocalDate,
                        LocalTime = growLog.LocalTime,
                        WeightKg = growLog.WeightKg,
                        HeightCm = growLog.HeightCm,
                        HeadCircumferenceCm = growLog.HeadCircumferenceCm,
                        Note = growLog.Note
                    }
                    : null,
                "ExcretionLog" => DynamoDbMapper.ToEntity<Domain.Entities.ExcretionLog>(item) is { } excrLog
                    ? new ExcretionLogDto
                    {
                        BabyId = excrLog.BabyId,
                        SK = excrLog.SK,
                        EventTimeUtc = excrLog.EventTimeUtc,
                        LocalDate = excrLog.LocalDate,
                        LocalTime = excrLog.LocalTime,
                        Type = excrLog.Type,
                        Notes = excrLog.Notes
                    }
                    : null,
                _ => null
            };

            if (details == null) return null;

            var note = entityType switch
            {
                "FeedingLog" => DynamoDbMapper.ToEntity<Domain.Entities.FeedingLog>(item)?.Note,
                "GrowthLog" => DynamoDbMapper.ToEntity<Domain.Entities.GrowthLog>(item)?.Note,
                "ExcretionLog" => DynamoDbMapper.ToEntity<Domain.Entities.ExcretionLog>(item)?.Notes,
                _ => null
            };

            return new LogEntryDto
            {
                Id = item["SK"].S,
                StartTime = DateTime.Parse(item.TryGetValue("EventTimeUtc", out var evt) ? evt.S : item["SK"].S),
                Type = logType,
                Note = note,
                Details = details
            };
        }
        catch
        {
            return null;
        }
    }
}
