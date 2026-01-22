using System.Text.Json.Serialization;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
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

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IFeedingRepository, FeedingRepository>();
builder.Services.AddScoped<IBabyRepository, BabyRepository>();
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<AutoMapperProfiles>());

builder.Services.AddDbContext<BabyCareAssistantDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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
app.UseAuthorization();

app.MapControllers();

app.Run();