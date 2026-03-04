namespace BabyCareAssistant.Domain.Entities;

public class Family: DynamoBaseEntity
{
    public string Name { get; set; } = string.Empty;
    
}