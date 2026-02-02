namespace BabyCareAssistant.Application.Features.GrowthLog.Dtos;

public record GrowthLogDto
{
    public Guid Id { get; init; }
    public Guid BabyId { get; init; }
    public DateTime DateMeasured { get; init; }
    public decimal WeightKg { get; init; }
    public decimal? HeightCm { get; init; }
    public decimal? HeadCircumferenceCm { get; init; }
    public string? Note { get; init; }
}
