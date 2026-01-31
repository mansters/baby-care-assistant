using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Domain.Entities;

public class FamilyMember
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid FamilyId { get; set; }
    public Family Family { get; set; } = null!;

    public FamilyRole Role { get; set; } = FamilyRole.Member;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}