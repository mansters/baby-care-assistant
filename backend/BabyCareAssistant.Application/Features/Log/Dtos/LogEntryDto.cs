using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.Log.Dtos;

public record LogEntryDto
{
    public string Id { get; init; } = string.Empty;
    public DateTime StartTime { get; init; }
    public LogType Type { get; init; }
    public string? Note { get; init; }
    public object Details { get; init; } = null!;
}
