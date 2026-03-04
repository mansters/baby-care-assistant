namespace BabyCareAssistant.Domain.Entities;

public class DynamoBaseEntity
{
    public string PK { get; set; } = string.Empty;
    public string SK { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    
    public string? GSI1PK { get; set; }
    public string? GSI1SK { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}