

namespace BabyCareAssistant.Domain.Entities
{
    public class Baby: DynamoBaseEntity
    {
        public string BabyId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PreferredName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string FamilyId { get; set; } = string.Empty;
        public string TimeZone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
    }
}