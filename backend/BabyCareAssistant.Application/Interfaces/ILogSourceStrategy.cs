using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Interfaces;

public interface ILogSourceStrategy
{
    LogType LogType { get; }
    Task<IEnumerable<LogEntryDto>> GetLogsAsync(
        string babyId, DateTime cursorTime, int count, CancellationToken cancellationToken = default);
}
