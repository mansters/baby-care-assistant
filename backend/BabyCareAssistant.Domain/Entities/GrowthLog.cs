namespace BabyCareAssistant.Domain.Entities;

public class GrowthLog: BaseEntity
{
    public DateTime DateMeasured { get; set; }
    public decimal WeightKg { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? HeadCircumferenceCm { get; set; }
    
    public Guid BabyId { get; set; }
    public virtual Baby Baby { get; set; }
}