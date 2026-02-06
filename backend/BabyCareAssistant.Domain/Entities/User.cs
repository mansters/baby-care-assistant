namespace BabyCareAssistant.Domain.Entities;

public class User: BaseEntity
{
    public string CognitoSubjectId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;

    public ICollection<FamilyMember> FamilyMemberships { get; set; } = new List<FamilyMember>();
}