using System.Text.Json.Serialization;

namespace BabyCareAssistant.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter<FeedingType>))]
public enum FeedingType
{
    Bottle,
    Breast,
    Solids
}