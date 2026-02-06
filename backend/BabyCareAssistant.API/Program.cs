using System.Text.Json.Serialization;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using BabyCareAssistant.API.Extensions;
using BabyCareAssistant.API.Services;
using BabyCareAssistant.Application.Common.Interfaces;
using BabyCareAssistant.Infrastructure.Persistence;
using BabyCareAssistant.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddAuthInfrastructure(builder.Configuration);

builder.Services.AddDbContext<BabyCareAssistantDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IFeedingRepository, FeedingRepository>();
builder.Services.AddScoped<IBabyRepository, BabyRepository>();
builder.Services.AddScoped<IGrowthLogRepository, GrowthLogRepository>();
builder.Services.AddScoped<IExcretionLogRepository, ExcretionLogRepository>();
builder.Services.AddScoped<IVaccineCatalogRepository, VaccineCatalogRepository>();
builder.Services.AddScoped<IVaccinationRecordRepository, VaccinationRecordRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


builder.Services.AddAutoMapper(cfg => cfg.AddProfile<AutoMapperProfiles>());
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<BabyCareAssistant.Application.Common.Result>());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
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