namespace BabyCareAssistant.Domain.Entities;

public class VaccinationRecord : BaseEntity
{
    public Guid BabyId { get; set; }
    public virtual Baby Baby { get; set; }

    public Guid VaccineCatalogId { get; set; }
    public virtual VaccineCatalog VaccineCatalog { get; set; }

    public DateTime AdministeredAt { get; set; }
    public string? Notes { get; set; }
}