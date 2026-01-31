using System.Reflection;
using BabyCareAssistant.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Persistence;

public class BabyCareAssistantDbContext: DbContext
{
    public BabyCareAssistantDbContext(DbContextOptions<BabyCareAssistantDbContext> options) : base(options)
    {
        
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Family> Families { get; set; }
    public DbSet<FamilyMember> FamilyMembers { get; set; }
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
        
        modelBuilder.Entity<FamilyMember>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.FamilyId });

            entity.HasOne(e => e.User)
                .WithMany(u => u.FamilyMemberships)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Family)
                .WithMany(f => f.Members)
                .HasForeignKey(e => e.FamilyId)
                .OnDelete(DeleteBehavior.Cascade);

        });

        modelBuilder.Entity<User>()
            .HasIndex(u => u.CognitoSubjectId)
            .IsUnique();
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
            if (entityEntry.Entity is BaseEntity entity)
            {
                entity.UpdatedAt = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}