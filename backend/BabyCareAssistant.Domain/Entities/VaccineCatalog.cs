namespace BabyCareAssistant.Domain.Entities;

public class VaccineCatalog: BaseEntity
{
    public string Name { get; set; }
    public decimal DueAtMonths { get; set; }
    
    public virtual ICollection<VaccinationRecord> Records { get; set; }
}