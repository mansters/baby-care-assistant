using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Domain.Entities;

public class ExcretionLog : BaseEntity
{
    public Guid BabyId { get; set; }
    public virtual Baby Baby { get; set; }
    
    public DateTime Time { get; set; }
    
    public ExcretionType Type { get; set; } 
    
    public string? Notes { get; set; } 
}