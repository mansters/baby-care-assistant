using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Domain.Entities.Feeding;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Persistence;

public class BabyCareAssistantDbContext: DbContext
{
    public BabyCareAssistantDbContext(DbContextOptions<BabyCareAssistantDbContext> options) : base(options)
    {
        
    }

    public DbSet<Baby> Babies { get; set; }

    public DbSet<FeedingLog> FeedingLogs { get; set; }
}