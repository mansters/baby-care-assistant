using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Helpers;
using Microsoft.Extensions.Configuration;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class UserRepository(
    IDynamoDbBaseRepository<User> userBaseRepository,
    IDynamoDbBaseRepository<FamilyMember> memberBaseRepository,
    IAmazonDynamoDB dynamoDbClient,
    IConfiguration configuration) : IUserRepository
{
    private readonly string _tableName = configuration["DynamoDb:TableName"] ?? "BabyCare";
    private readonly string _gsiName = configuration["DynamoDb:GSI1Name"] ?? "GSI1";

    public async Task<User?> GetByCognitoIdAsync(string cognitoSubjectId, CancellationToken ct)
    {
        return await userBaseRepository.GetByKeyAsync($"USER#{cognitoSubjectId}", "META", ct);
    }

    public async Task<(User User, List<Family> Families, List<Baby> Babies)?> GetUserWithFamiliesAsync(string cognitoSubjectId, CancellationToken ct)
    {
        var user = await GetByCognitoIdAsync(cognitoSubjectId, ct);
        if (user == null) return null;

        var memberRequest = new QueryRequest
        {
            TableName = _tableName,
            IndexName = _gsiName,
            KeyConditionExpression = "GSI1PK = :gsi1pk AND begins_with(GSI1SK, :prefix)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":gsi1pk", new AttributeValue { S = $"USER#{cognitoSubjectId}" } },
                { ":prefix", new AttributeValue { S = "FAMILY#" } }
            }
        };

        var memberResponse = await dynamoDbClient.QueryAsync(memberRequest, ct);
        var familyMembers = memberResponse.Items
            .Select(DynamoDbMapper.ToEntity<FamilyMember>)
            .Where(x => x != null)
            .ToList()!;

        var families = new List<Family>();
        var allBabies = new List<Baby>();

        foreach (var member in familyMembers)
        {
            if (member == null) continue;
            
            var familyResponse = await dynamoDbClient.GetItemAsync(new GetItemRequest
            {
                TableName = _tableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "PK", new AttributeValue { S = $"FAMILY#{member.FamilyId}" } },
                    { "SK", new AttributeValue { S = "META" } }
                }
            }, ct);

            if (familyResponse.IsItemSet)
            {
                var family = DynamoDbMapper.ToEntity<Family>(familyResponse.Item);
                if (family != null) families.Add(family);
            }

            var babyRequest = new QueryRequest
            {
                TableName = _tableName,
                IndexName = _gsiName,
                KeyConditionExpression = "GSI1PK = :gsi1pk AND begins_with(GSI1SK, :prefix)",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":gsi1pk", new AttributeValue { S = $"FAMILY#{member.FamilyId}" } },
                    { ":prefix", new AttributeValue { S = "BABY#" } }
                }
            };

            var babyResponse = await dynamoDbClient.QueryAsync(babyRequest, ct);
            var babies = babyResponse.Items
                .Select(DynamoDbMapper.ToEntity<Baby>)
                .Where(x => x != null);
            
            allBabies.AddRange(babies!);
        }

        return (user, families, allBabies);
    }

    public async Task<User> CreateAsync(User user, CancellationToken ct)
    {
        user.PK = $"USER#{user.CognitoSubjectId}";
        user.SK = "META";
        user.EntityType = nameof(User);
        
        return await userBaseRepository.CreateAsync(user, ct);
    }

    public async Task<User?> UpdateAsync(string cognitoSubjectId, Action<User> mutate, CancellationToken ct)
    {
        return await userBaseRepository.UpdateAsync($"USER#{cognitoSubjectId}", "META", mutate, ct);
    }
}