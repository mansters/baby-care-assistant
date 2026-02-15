namespace BabyCareAssistant.Application.Features.Log.Dtos;

public record FeedingDetailsDto
{
    public string FeedingType { get; init; } = string.Empty;
    public int? LeftBreastDurationMinutes { get; init; }
    public int? RightBreastDurationMinutes { get; init; }
    public int AmountMl { get; init; }
}
