using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BabyCareAssistant.Infrastructure.Persistence.Configurations;

public class ExcretionLogConfiguration: IEntityTypeConfiguration<ExcretionLog>
{
    public void Configure(EntityTypeBuilder<ExcretionLog> builder)
    {
        builder.ToTable("ExcretionLogs");

        builder.Property(x => x.Time)
            .IsRequired();

        builder.Property(x => x.Type)
            .HasConversion<string>();

        var enumValues = Enum.GetNames(typeof(ExcretionType));
        var sqlList = string.Join("', '", enumValues);
        var sqlConstraint = $"\"Type\" IN ('{sqlList}')";

        builder.ToTable(t => 
            t.HasCheckConstraint("CK_ExcretionLogs_Type", sqlConstraint)
        );

        builder.HasOne(log => log.Baby)
            .WithMany(baby => baby.ExcretionLogs)
            .HasForeignKey(log => log.BabyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}