namespace BabyCareAssistant.Application.Features.GrowthLog.Dtos;

public record GrowthLogDto
{
    public string BabyId { get; init; } = string.Empty;
    public string SK { get; init; } = string.Empty;
    public DateTime EventTimeUtc { get; init; }
    public string LocalDate { get; set; } = string.Empty;
    
    public decimal WeightKg { get; init; }
    public decimal? HeightCm { get; init; }
    public decimal? HeadCircumferenceCm { get; init; }
    public string? Note { get; init; }
}
