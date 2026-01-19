using BabyCareAssistant.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BabyCareAssistant.Infrastructure.Persistence.Configurations
{
    public class GrowthLogConfiguration : IEntityTypeConfiguration<GrowthLog>
    {
        public void Configure(EntityTypeBuilder<GrowthLog> builder)
        {
            builder.ToTable("GrowthLogs");

            builder.Property(x => x.WeightKg)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(x => x.HeightCm)
                .HasPrecision(18, 2); 
            
            builder.Property(x => x.HeadCircumferenceCm)
                .HasPrecision(18, 2);

            builder.HasOne(log => log.Baby)
                .WithMany(baby => baby.GrowthLogs)
                .HasForeignKey(log => log.BabyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}