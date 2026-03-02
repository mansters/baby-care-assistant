using Amazon;
using Amazon.DynamoDBv2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BabyCareAssistant.Infrastructure.Extensions;

public static class DynamoDbServiceCollectionExtensions
{
    public static IServiceCollection AddDynamoDbInfrastructure(this IServiceCollection services,
        IConfiguration configuration)
    {
        var region = configuration["DynamoDb:Region"]
                     ?? configuration["AWS:Region"];

        if (string.IsNullOrWhiteSpace(region))
        {
            throw new InvalidOperationException("Missing DynamoDB region. Set DynamoDb:Region (or AWS:Region).\"");
        }

        services.AddSingleton<IAmazonDynamoDB>(_ =>
        {
            var clientConfig = new AmazonDynamoDBConfig
            {
                RegionEndpoint = RegionEndpoint.GetBySystemName(region!)
            };

            return new AmazonDynamoDBClient(clientConfig);
        });

        return services;
    }
}