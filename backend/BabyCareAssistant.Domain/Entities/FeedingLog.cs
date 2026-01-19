using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Domain.Entities.Feeding;

public class FeedingLog: BaseEntity
{
    public DateTime FeedingTime { get; set; }
    public int? DurationMinutes { get; set; }
    public FeedingType Type { get; set; }
    public int AmountMl { get; set; }
    
    public Guid BabyId { get; set; }
    public virtual Baby? Baby { get; set; }
}