using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;

public record UpdateGrowthLogDto
{
    [Required]
    public string BabyId { get; init; } = string.Empty;

    [Required]
    public string SK { get; init; } = string.Empty;

    [Required]
    public DateTime LocalDateTime { get; init; }

    [Required]
    [Range(0.01, 300)]
    public decimal? WeightKg { get; init; }

    [Range(0, 400)]
    public decimal? HeightCm { get; init; }

    [Range(0, 400)]
    public decimal? HeadCircumferenceCm { get; init; }

    [MaxLength(500)]
    public string? Note { get; init; }
}
