namespace BabyCareAssistant.Application.Features.Log.Dtos;

public record PaginatedLogResponse
{
    public List<LogEntryDto> Items { get; init; } = new();
    public string? NextCursor { get; init; }
}
