using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Domain.Entities;

public class FamilyMember: DynamoBaseEntity
{
    public string UserId { get; set; } = null!;

    public string FamilyId { get; set; } = null!;

    public FamilyRole Role { get; set; } = FamilyRole.Member;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    
    public string? UserName { get; set; }
}