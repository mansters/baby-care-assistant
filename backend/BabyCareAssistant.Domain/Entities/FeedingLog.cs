using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Domain.Entities;

public class FeedingLog: LogBaseEntity
{
    protected override string LogPrefix { get; } = "FEED";
    
    public FeedingType Type { get; set; }
    public int AmountMl { get; set; }

    public int? LeftBreastDurationMinutes { get; set; }
    public int? RightBreastDurationMinutes { get; set; }
    
    public string? Note { get; set; }
}