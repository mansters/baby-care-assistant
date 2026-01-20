using System.Reflection;
using BabyCareAssistant.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Persistence;

public class BabyCareAssistantDbContext: DbContext
{
    public BabyCareAssistantDbContext(DbContextOptions<BabyCareAssistantDbContext> options) : base(options)
    {
        
    }

    public DbSet<Baby> Babies { get; set; }

    public DbSet<FeedingLog> FeedingLogs { get; set; }
    public DbSet<ExcretionLog> ExcretionLogs { get; set; }
    public DbSet<GrowthLog> GrowthLogs { get; set; }
    public DbSet<VaccinationRecord> VaccinationRecords { get; set; }
    public DbSet<VaccineCatalog> VaccineCatalogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}