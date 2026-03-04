using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Domain.Entities;

public class ExcretionLog : LogBaseEntity
{
    protected override string LogPrefix { get; } = "EXCR";
    
    public ExcretionType Type { get; set; } 
    
    public string? Notes { get; set; }

}