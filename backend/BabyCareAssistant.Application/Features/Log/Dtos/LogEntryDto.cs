using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.Log.Dtos;

public record LogEntryDto
{
    public Guid Id { get; init; }
    public DateTime StartTime { get; init; }
    public LogType Type { get; init; }
    public string? Note { get; init; }
    public object Details { get; init; } = null!;
}
