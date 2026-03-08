using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class DynamoDbBaseRepository<T>(IAmazonDynamoDB client, IConfiguration config): IDynamoDbBaseRepository<T> where T : DynamoBaseEntity
{
    private readonly string? _tableName = config["DynamoDb:TableName"];

    public async Task<T?> GetByKeyAsync(string pk, string sk, CancellationToken ct)
    {
        var request = new GetItemRequest
        {
            TableName = _tableName,
            Key = new Dictionary<string, AttributeValue>
            {
                { "PK", new AttributeValue { S = pk } },
                { "SK", new AttributeValue { S = sk } }
            }
        };
        
        var response = await client.GetItemAsync(request, ct);

        if (!response.IsItemSet) return null;
        
        return Infrastructure.Helpers.DynamoDbMapper.ToEntity<T>(response.Item);
    }

    public async Task<List<T>> GetListAsync(string pk, string skPrefix, bool ascending, int limit, string? cursor, CancellationToken ct, string? entityTypeFilter = null)
    {
        var rawItems = await GetListResponseAsync(pk, skPrefix, ascending, limit, cursor, ct, entityTypeFilter);
        
        return rawItems.Select(Infrastructure.Helpers.DynamoDbMapper.ToEntity<T>)
            .Where(x => x != null)
            .ToList()!;
    }

    public async Task<List<T>> GetListBeforeAsync(string pk, string skPrefix, DateTime maxTime, int limit, CancellationToken ct, string? entityTypeFilter = null)
    {
        var minSk = skPrefix;
        
        // Prevent overflow if maxTime is DateTime.MaxValue and local timezone is GMT-x
        var maxTimeUtcStr = maxTime == DateTime.MaxValue 
            ? "9999-12-31T23:59:59.999Z" 
            : maxTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
            
        var maxSk = $"{skPrefix}{maxTimeUtcStr}";

        var readLimit = entityTypeFilter != null ? limit * 5 : limit;

        var request = new Amazon.DynamoDBv2.Model.QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk AND SK BETWEEN :minSk AND :maxSk",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":pk", new AttributeValue { S = pk } },
                { ":minSk", new AttributeValue { S = minSk } },
                { ":maxSk", new AttributeValue { S = maxSk } }
            },
            ScanIndexForward = false,
            Limit = readLimit
        };

        if (!string.IsNullOrEmpty(entityTypeFilter))
        {
            request.FilterExpression = "EntityType = :entityType";
            request.ExpressionAttributeValues[":entityType"] = new AttributeValue { S = entityTypeFilter };
        }

        var response = await client.QueryAsync(request, ct);

        var results = response.Items.Select(Infrastructure.Helpers.DynamoDbMapper.ToEntity<T>)
            .Where(x => x != null)
            .ToList()!;

        return results.Take(limit).ToList();
    }

    public async Task<T?> GetLatestAsync(string pk, string skPrefix, CancellationToken ct, string? entityTypeFilter = null)
    {
        var readLimit = entityTypeFilter != null ? 50 : 1;
        var rawItems = await GetListResponseAsync(pk, skPrefix, false, readLimit, null, ct, entityTypeFilter);

        var latestRawItem = rawItems.FirstOrDefault();

        if (latestRawItem == null) return null;
        
        return Infrastructure.Helpers.DynamoDbMapper.ToEntity<T>(latestRawItem);
    }

    private async Task<List<Dictionary<string, AttributeValue>>> GetListResponseAsync(string pk, string skPrefix, bool ascending, int limit, string? cursor, CancellationToken ct, string? entityTypeFilter = null)
    {
        var readLimit = entityTypeFilter != null ? Math.Max(limit * 5, 50) : limit;

        var request = new Amazon.DynamoDBv2.Model.QueryRequest
        {
            TableName = _tableName,
            KeyConditionExpression = "PK = :pk AND begins_with(SK, :skPrefix)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":pk", new AttributeValue { S = pk } },
                { ":skPrefix", new AttributeValue { S = skPrefix } }
            },
            ScanIndexForward = ascending,
            Limit = readLimit
        };

        if (!string.IsNullOrEmpty(entityTypeFilter))
        {
            request.FilterExpression = "EntityType = :entityType";
            request.ExpressionAttributeValues[":entityType"] = new AttributeValue { S = entityTypeFilter };
        }

        if (!string.IsNullOrEmpty(cursor))
        {
            request.ExclusiveStartKey = new Dictionary<string, AttributeValue>
            {
                { "PK", new AttributeValue { S = pk } },
                { "SK", new AttributeValue { S = cursor } }
            };
        }

        // When filtering, paginate until we collect enough results
        if (entityTypeFilter != null)
        {
            var allItems = new List<Dictionary<string, AttributeValue>>();
            do
            {
                var response = await client.QueryAsync(request, ct);
                allItems.AddRange(response.Items);

                if (allItems.Count >= limit || response.LastEvaluatedKey == null || response.LastEvaluatedKey.Count == 0)
                    break;

                request.ExclusiveStartKey = response.LastEvaluatedKey;
            } while (true);

            return allItems;
        }

        var singleResponse = await client.QueryAsync(request, ct);
        return singleResponse.Items;
    }

    public async Task<T> CreateAsync(T entity, CancellationToken ct)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        var request = new Amazon.DynamoDBv2.Model.PutItemRequest
        {
            TableName = _tableName,
            Item = Infrastructure.Helpers.DynamoDbMapper.ToAttributeMap(entity)
        };
        
        await client.PutItemAsync(request, ct);
        return entity;
    }

    public async Task<T?> UpdateAsync(string pk, string sk, Action<T> mutate, CancellationToken ct)
    {
        var existingItem = await GetByKeyAsync(pk, sk, ct);
        
        if (existingItem == null) return null;
        
        var oldSk = existingItem.SK;

        mutate(existingItem);
        existingItem.UpdatedAt = DateTime.UtcNow;

        if (existingItem.SK != oldSk)
        {
            await ReplaceItemWithTransactionAsync(pk, oldSk, existingItem, ct);
        }
        else
        {
            await OverwriteExistingItemAsync(existingItem, ct);
        }

        return existingItem;
    }

    private async Task ReplaceItemWithTransactionAsync(string pk, string oldSk, T newItem, CancellationToken ct)
    {
        var transactRequest = new TransactWriteItemsRequest
        {
            TransactItems = [
                new TransactWriteItem
                {
                    Delete = new Amazon.DynamoDBv2.Model.Delete
                    {
                        TableName = _tableName,
                        Key = new Dictionary<string, AttributeValue>
                        {
                            { "PK", new AttributeValue { S = pk } },
                            { "SK", new AttributeValue { S = oldSk } }
                        }
                    }
                },
                new TransactWriteItem
                {
                    Put = new Amazon.DynamoDBv2.Model.Put
                    {
                        TableName = _tableName,
                        Item = Infrastructure.Helpers.DynamoDbMapper.ToAttributeMap(newItem)
                    }
                }]
        };
        
        await client.TransactWriteItemsAsync(transactRequest, ct);
    }

    private async Task OverwriteExistingItemAsync(T itemToSave, CancellationToken ct)
    {
        var putRequest = new Amazon.DynamoDBv2.Model.PutItemRequest
        {
            TableName = _tableName,
            Item = Infrastructure.Helpers.DynamoDbMapper.ToAttributeMap(itemToSave)
        };
        
        await client.PutItemAsync(putRequest, ct);
    }
    
    public async Task<bool> DeleteAsync(string pk, string sk, CancellationToken ct)
    {
        var request = new Amazon.DynamoDBv2.Model.DeleteItemRequest
        {
            TableName = _tableName,
            Key = new Dictionary<string, AttributeValue>
            {
                { "PK", new AttributeValue { S = pk } },
                { "SK", new AttributeValue { S = sk } }
            }
        };
        
        var response = await client.DeleteItemAsync(request, ct);
        
        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }
}