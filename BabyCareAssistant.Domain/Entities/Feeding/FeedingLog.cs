namespace BabyCareAssistant.Domain.Entities.Feeding;

public class FeedingLog
{
    public Guid Id { get; set; }
    public DateTime FeedingTime { get; set; }
    public int DurationMinutes { get; set; }
    public string Type { get; set; }
    public int AmountMl { get; set; }
    
    public Guid BabyId { get; set; }
    public Baby? Baby { get; set; }
}