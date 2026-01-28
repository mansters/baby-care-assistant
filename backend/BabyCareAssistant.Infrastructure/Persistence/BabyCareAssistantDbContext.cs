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

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                e.State == EntityState.Added || 
                e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            var entity = (BaseEntity)entityEntry.Entity;
            entity.UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}