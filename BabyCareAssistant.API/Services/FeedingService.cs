using BabyCareAssistant.API.Models.Feeding;

namespace BabyCareAssistant.API.Services;

public class FeedingService: IFeedingService
{
    public List<FeedingLog> GetAll()
    {
        return new List<FeedingLog>()
        {
            new FeedingLog()
            {
                Id = Guid.NewGuid(),
                Type = "Bottle",
                FeedingTime = DateTime.Now.AddHours(-2),
                DurationMinutes = 30,
                AmountMl = 100
            },
            new FeedingLog()
            {
                Id = Guid.NewGuid(),
                Type = "Bottle",
                FeedingTime = DateTime.Now.AddHours(-4),
                DurationMinutes = 30,
                AmountMl = 100
            },
        };
    }
}