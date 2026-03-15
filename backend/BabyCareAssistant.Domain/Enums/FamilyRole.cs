using System.Text.Json.Serialization;

namespace BabyCareAssistant.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<FamilyRole>))]
public enum FamilyRole
{
    Admin = 0,   // Can manage family members and delete families
    Member = 1,  // Can read/write daily logs
    Guest = 2    // Read-only
}