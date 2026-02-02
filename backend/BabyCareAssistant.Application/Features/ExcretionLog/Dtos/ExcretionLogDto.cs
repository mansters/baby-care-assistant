using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Dtos;

public record ExcretionLogDto
{
    public Guid Id { get; init; }
    public Guid BabyId { get; init; }
    public DateTime Time { get; init; }
    public ExcretionType Type { get; init; }
    public string? Notes { get; init; }
}
