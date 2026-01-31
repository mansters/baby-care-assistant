namespace BabyCareAssistant.Domain.Entities;

public class Family: BaseEntity
{
    public string Name { get; set; } = string.Empty;
    
    public ICollection<FamilyMember> Members { get; set; } = new List<FamilyMember>();
    public ICollection<Baby> Babies { get; set; } = new List<Baby>();
}