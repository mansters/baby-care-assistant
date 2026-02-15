using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Interfaces;

public interface ILogSourceStrategy
{
    LogType LogType { get; }
    Task<IEnumerable<LogEntryDto>> GetLogsAsync(
        Guid babyId, DateTime cursorTime, int count, CancellationToken cancellationToken = default);
}
