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
        var awsOptions = configuration.GetAWSOptions();
        services.AddDefaultAWSOptions(awsOptions);

        var useLocal = bool.TryParse(configuration["DynamoDb:UseLocal"], out var parsed) && parsed;
        if (useLocal)
        {
            var serviceUrl = configuration["DynamoDb:Endpoint"] ?? "http://localhost:8000";
            var region = configuration["AWS:Region"] ?? "ap-northeast-1";
            services.AddSingleton<IAmazonDynamoDB>(_ =>
            {
                var clientConfig = new AmazonDynamoDBConfig
                {
                    ServiceURL = serviceUrl,
                    AuthenticationRegion = region
                };
                return new AmazonDynamoDBClient("dummy", "secret", clientConfig);
            });
        }
        else
        {
            services.AddAWSService<IAmazonDynamoDB>();
        }

        return services;
    }
}