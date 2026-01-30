using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace BabyCareAssistant.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAuthInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Config
        var userPoolId = configuration["Authentication:Cognito:UserPoolId"];
        var clientId = configuration["Authentication:Cognito:ClientId"];
        var region = "ap-northeast-1"; // Tokyo
        var authority = $"https://cognito-idp.{region}.amazonaws.com/{userPoolId}";

        // Add Authentication
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
        });

        return services;
    }
}