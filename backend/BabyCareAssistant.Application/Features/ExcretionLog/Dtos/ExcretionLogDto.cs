using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Dtos;

public record ExcretionLogDto
{
    public string BabyId { get; init; } = string.Empty;
    public string SK { get; init; } = string.Empty;
    public DateTime EventTimeUtc { get; init; }
    public ExcretionType Type { get; init; }
    public string? Notes { get; init; }
}
