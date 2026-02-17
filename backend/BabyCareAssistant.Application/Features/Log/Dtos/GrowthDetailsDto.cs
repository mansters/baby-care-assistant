namespace BabyCareAssistant.Application.Features.Log.Dtos;

public record GrowthDetailsDto
{
    public decimal WeightKg { get; init; }
    public decimal? HeightCm { get; init; }
    public decimal? HeadCircumferenceCm { get; init; }
}
