using System.Text.Json.Serialization;

namespace BabyCareAssistant.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<LogType>))]
public enum LogType
{
    Feeding,
    Sleep,
    Diaper,
    Growth
}
