namespace BabyCareAssistant.API.Models.Feeding;

public class FeedingLog
{
    public Guid Id { get; set; }
    public DateTime FeedingTime { get; set; }
    public int DurationMinutes { get; set; }
    public string Type { get; set; }
    public int AmountMl { get; set; }
}