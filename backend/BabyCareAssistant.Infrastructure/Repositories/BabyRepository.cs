using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Helpers;
using Microsoft.Extensions.Configuration;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class BabyRepository(IDynamoDbBaseRepository<Baby> dynamoDbBaseRepository, IAmazonDynamoDB dynamoDbClient, IConfiguration configuration) : IBabyRepository
{
    private readonly string _tableName = configuration["DynamoDb:TableName"] ?? "BabyCare";
    private readonly string _gsiName = configuration["DynamoDb:GSI1Name"] ?? "GSI1PK-GSI1SK-index";

    public async Task<Baby?> GetByIdAsync(string babyId, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.GetByKeyAsync($"BABY#{babyId}", "META", ct);
    }

    public async Task<List<Baby>> GetByFamilyIdAsync(string familyId, CancellationToken ct)
    {
        var request = new QueryRequest
        {
            TableName = _tableName,
            IndexName = _gsiName,
            KeyConditionExpression = "GSI1PK = :gsi1pk AND begins_with(GSI1SK, :prefix)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":gsi1pk", new AttributeValue { S = $"FAMILY#{familyId}" } },
                { ":prefix", new AttributeValue { S = "BABY#" } }
            }
        };

        var response = await dynamoDbClient.QueryAsync(request, ct);

        return response.Items
            .Select(DynamoDbMapper.ToEntity<Baby>)
            .Where(x => x != null)
            .ToList()!;
    }

    public async Task<Baby> CreateAsync(Baby baby, CancellationToken ct)
    {
        baby.PK = $"BABY#{baby.BabyId}";
        baby.SK = "META";
        baby.GSI1PK = $"FAMILY#{baby.FamilyId}";
        baby.GSI1SK = $"BABY#{baby.BabyId}";
        baby.EntityType = nameof(Baby);
        
        return await dynamoDbBaseRepository.CreateAsync(baby, ct);
    }

    public async Task<Baby?> UpdateAsync(string babyId, Baby item, CancellationToken ct)
    {
        var mutate = (Baby baby) =>
        {
            baby.FirstName = item.FirstName;
            baby.LastName = item.LastName;
            baby.PreferredName = item.PreferredName;
            baby.DateOfBirth = item.DateOfBirth;
            baby.TimeZone = item.TimeZone;
            baby.Gender = item.Gender;
            baby.UpdatedAt = DateTime.UtcNow;
        };
        
        return await dynamoDbBaseRepository.UpdateAsync($"BABY#{babyId}", "META", mutate, ct);
    }

    public async Task<bool> DeleteAsync(string babyId, CancellationToken ct)
    {
        return await dynamoDbBaseRepository.DeleteAsync($"BABY#{babyId}", "META", ct);
    }
}
