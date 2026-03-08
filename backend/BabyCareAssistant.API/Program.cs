using System.Text.Json.Serialization;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using BabyCareAssistant.API.Extensions;
using BabyCareAssistant.API.Services;
using BabyCareAssistant.Application.Common.Interfaces;
using BabyCareAssistant.Application.Services;
using BabyCareAssistant.Infrastructure.Repositories;
using Amazon; 
using Amazon.DynamoDBv2;
using BabyCareAssistant.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddDynamoDbInfrastructure(builder.Configuration);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped(typeof(IDynamoDbBaseRepository<>), typeof(DynamoDbBaseRepository<>));
builder.Services.AddScoped<IFeedingRepository, FeedingRepository>();
builder.Services.AddScoped<IBabyRepository, BabyRepository>();
builder.Services.AddScoped<IGrowthLogRepository, GrowthLogRepository>();
builder.Services.AddScoped<IExcretionLogRepository, ExcretionLogRepository>();

builder.Services.AddScoped<ILogSourceStrategy, FeedingLogStrategy>();
builder.Services.AddScoped<ILogSourceStrategy, GrowthLogStrategy>();
builder.Services.AddScoped<ILogSourceStrategy, ExcretionLogStrategy>();
builder.Services.AddScoped<ILogAggregationService, LogAggregationService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<BabyCareAssistant.Domain.Services.FeedingPredictionService>();

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<AutoMapperProfiles>());
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<BabyCareAssistant.Application.Common.Result>());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();