
using BabyCareAssistant.Domain.Entities.Feeding;

namespace BabyCareAssistant.Domain.Entities
{
    public class Baby
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }

        public ICollection<FeedingLog> FeedingLogs { get; set; } = new List<FeedingLog>();
    }
}