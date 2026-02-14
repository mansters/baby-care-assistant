using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Domain.Entities;

public class FeedingLog: BaseEntity
{
    public DateTime FeedingTime { get; set; }
    public int? DurationMinutes { get; set; }
    public FeedingType Type { get; set; }
    public int AmountMl { get; set; }

    public int? LeftBreastDurationMinutes { get; set; }
    public int? RightBreastDurationMinutes { get; set; }
    
    public string? Note { get; set; }

    public Guid BabyId { get; set; }
    public virtual Baby? Baby { get; set; }
}