using BabyCareAssistant.Domain.Entities.Feeding;
using BabyCareAssistant.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BabyCareAssistant.Infrastructure.Persistence.Configurations;

public class FeedingLogConfiguration: IEntityTypeConfiguration<FeedingLog>
{
    public void Configure(EntityTypeBuilder<FeedingLog> builder)
    {
        builder.ToTable("FeedingLogs");
        
        builder.Property(log => log.FeedingTime)
            .IsRequired();
        
        builder.Property(log => log.Type)
            .HasConversion<string>();

        var enumValues = Enum.GetNames(typeof(FeedingType));
        var sqlList = string.Join("', '", enumValues);
        var sqlConstraint = $"\"Type\" IN ('{sqlList}')";
        
        builder.ToTable(t => 
            t.HasCheckConstraint("CK_FeedingLogs_Type", sqlConstraint)
        );
        
        builder.HasOne(log => log.Baby)
            .WithMany(baby => baby.FeedingLogs)
            .HasForeignKey(log => log.BabyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}