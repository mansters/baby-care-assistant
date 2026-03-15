using System.Text.Json.Serialization;

namespace BabyCareAssistant.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<ExcretionType>))]
public enum ExcretionType
{
    Wet,
    Dirty, 
    Mixed
}