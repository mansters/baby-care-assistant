using BabyCareAssistant.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BabyCareAssistant.Infrastructure.Persistence.Configurations;

public class VaccinationRecordConfiguration: IEntityTypeConfiguration<VaccinationRecord>
{
    public void Configure(EntityTypeBuilder<VaccinationRecord> builder)
    {
        builder.ToTable("VaccinationRecords");

        builder.Property(log => log.AdministeredAt)
            .IsRequired();

        builder.Property(log => log.Notes)
            .HasMaxLength(2000);
        
        builder.HasOne(log => log.Baby)
            .WithMany(baby => baby.VaccinationRecords)
            .HasForeignKey(log => log.BabyId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(log => log.VaccineCatalog)
            .WithMany(catalog => catalog.Records)
            .HasForeignKey(log => log.VaccineCatalogId)
            .OnDelete(DeleteBehavior.Restrict);
            
    }
}