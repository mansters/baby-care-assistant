using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;

public record UpdateGrowthLogDto
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public DateTime DateMeasured { get; init; }

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
