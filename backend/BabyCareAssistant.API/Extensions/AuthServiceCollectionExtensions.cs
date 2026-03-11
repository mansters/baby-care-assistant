using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace BabyCareAssistant.API.Extensions;

public static class AuthServiceCollectionExtensions
{
    public static IServiceCollection AddCognitoAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var userPoolId = configuration["Authentication:Cognito:UserPoolId"];
        var clientId = configuration["Authentication:Cognito:ClientId"];
        var region = configuration["Authentication:Cognito:Region"];
        var authority = $"https://cognito-idp.{region}.amazonaws.com/{userPoolId}";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = authority;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = authority,
                ValidateAudience = true,
                ValidAudience = clientId,
                ValidateLifetime = true,
                NameClaimType = "email" 
            };
            
            // When requests come through Lambda Function URL with AWS_IAM auth,
            // SigV4 signing overwrites the standard Authorization header.
            // The Cognito JWT is passed in the X-Amz-Bearer custom header instead.
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    if (context.Request.Headers.TryGetValue("x-amz-bearer", out var bearerValues))
                    {
                        var bearerToken = bearerValues.FirstOrDefault();
                        if (!string.IsNullOrEmpty(bearerToken))
                        {
                            // Strip "Bearer " prefix if present
                            context.Token = bearerToken.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                                ? bearerToken.Substring(7)
                                : bearerToken;
                        }
                    }
                    return Task.CompletedTask;
                }
            };
        });

        return services;
    }
}