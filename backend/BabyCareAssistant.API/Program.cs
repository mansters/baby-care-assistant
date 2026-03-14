using System.Text.Json.Serialization;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using BabyCareAssistant.API.Endpoints;
using BabyCareAssistant.API.Extensions;
using BabyCareAssistant.API.Services;
using BabyCareAssistant.Application;
using BabyCareAssistant.Application.Common.Interfaces;
using BabyCareAssistant.Application.Services;
using BabyCareAssistant.Infrastructure.Repositories;
using Amazon; 
using Amazon.DynamoDBv2;
using BabyCareAssistant.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi, options =>
{
    options.Serializer = new Amazon.Lambda.Serialization.SystemTextJson.SourceGeneratorLambdaJsonSerializer<BabyCareAssistant.API.Infrastructure.ApiJsonSerializerContext>();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://192.168.1.65:3000", "https://linnie-clamorous-jurnee.ngrok-free.dev")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddCognitoAuthentication(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.AddDynamoDbInfrastructure(builder.Configuration);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped(typeof(IDynamoDbBaseRepository<>), typeof(DynamoDbBaseRepository<>));
builder.Services.AddScoped<IFeedingRepository, FeedingRepository>();
builder.Services.AddScoped<IBabyRepository, BabyRepository>();
builder.Services.AddScoped<IGrowthLogRepository, GrowthLogRepository>();
builder.Services.AddScoped<IExcretionLogRepository, ExcretionLogRepository>();

builder.Services.AddScoped<ILogAggregationService, LogAggregationService>();
builder.Services.AddScoped<ILogQueryRepository, LogQueryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<BabyCareAssistant.Domain.Services.FeedingPredictionService>();


builder.Services.AddApplicationServices();

builder.Services.AddEndpointsApiExplorer();

// Web API Controllers are being replaced by Minimal APIs for AOT Support.
// Note: JSON source generated context is configured globally within Lambda Serializer 
// and also locally below using HttpJsonOptions.
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, BabyCareAssistant.API.Infrastructure.ApiJsonSerializerContext.Default);
});


var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    // 生产环境可以移除 CORS，因为后端不再暴露给浏览器
    app.UseCors("AllowFrontend");
}

app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.MapUserEndpoints();
app.MapBabyEndpoints();
app.MapExcretionLogEndpoints();
app.MapFeedingLogEndpoints();
app.MapGrowthLogEndpoints();
app.MapLogEndpoints();

app.Run();