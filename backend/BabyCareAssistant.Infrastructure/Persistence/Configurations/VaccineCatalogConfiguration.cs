using BabyCareAssistant.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BabyCareAssistant.Infrastructure.Persistence.Configurations;

public class VaccineCatalogConfiguration: IEntityTypeConfiguration<VaccineCatalog>
{
    public void Configure(EntityTypeBuilder<VaccineCatalog> builder)
    {
        builder.ToTable("VaccineCatalog");

        builder.Property(x => x.Name)
            .IsRequired();

        builder.Property(x => x.DueAtMonths)
            .HasPrecision(6, 2)
            .IsRequired();
    }
}