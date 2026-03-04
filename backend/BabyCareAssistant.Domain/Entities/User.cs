namespace BabyCareAssistant.Domain.Entities;

public class User: DynamoBaseEntity
{
    public string CognitoSubjectId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}