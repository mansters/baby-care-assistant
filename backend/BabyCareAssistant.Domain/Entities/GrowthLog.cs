namespace BabyCareAssistant.Domain.Entities;

public class GrowthLog: LogBaseEntity
{
    protected override string LogPrefix { get; } = "GROW";
    
    public decimal WeightKg { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? HeadCircumferenceCm { get; set; }
    
    public string? Note { get; set; }
}