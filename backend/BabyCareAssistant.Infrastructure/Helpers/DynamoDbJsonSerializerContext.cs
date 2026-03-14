using System.Text.Json.Serialization;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Infrastructure.Helpers;

[JsonSourceGenerationOptions(
    PropertyNamingPolicy = JsonKnownNamingPolicy.Unspecified, 
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    Converters = [
        typeof(JsonStringEnumConverter<FeedingType>), 
        typeof(JsonStringEnumConverter<ExcretionType>), 
        typeof(JsonStringEnumConverter<LogType>), 
        typeof(JsonStringEnumConverter<FamilyRole>)
    ]
)]
[JsonSerializable(typeof(User))]
[JsonSerializable(typeof(Baby))]
[JsonSerializable(typeof(Family))]
[JsonSerializable(typeof(FamilyMember))]
[JsonSerializable(typeof(FeedingLog))]
[JsonSerializable(typeof(GrowthLog))]
[JsonSerializable(typeof(ExcretionLog))]
public partial class DynamoDbJsonSerializerContext : JsonSerializerContext
{
}
