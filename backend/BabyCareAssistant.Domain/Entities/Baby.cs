

namespace BabyCareAssistant.Domain.Entities
{
    public class Baby: BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PreferredName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }

        public virtual ICollection<FeedingLog> FeedingLogs { get; set; } = new List<FeedingLog>();
        public virtual ICollection<GrowthLog> GrowthLogs { get; set; } = new List<GrowthLog>();
        public virtual ICollection<ExcretionLog> ExcretionLogs { get; set; } = new List<ExcretionLog>();
        public virtual ICollection<VaccinationRecord> VaccinationRecords { get; set; } = new List<VaccinationRecord>();
    }
}