using BabyCareAssistant.API.Models.Feeding;

namespace BabyCareAssistant.API.Services;

public interface IFeedingService
{
    List<FeedingLog> GetAll();
}