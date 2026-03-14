using System.Text.Json.Serialization;
using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Features.Users.Queries.GetUserContext;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.API.Infrastructure;

[JsonSourceGenerationOptions(
    PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    Converters = [
        typeof(JsonStringEnumConverter<FeedingType>), 
        typeof(JsonStringEnumConverter<ExcretionType>), 
        typeof(JsonStringEnumConverter<LogType>), 
        typeof(JsonStringEnumConverter<FamilyRole>)
    ]
)]

// Baby
[JsonSerializable(typeof(BabyDto))]
[JsonSerializable(typeof(CreateBabyDto))]
[JsonSerializable(typeof(UpdateBabyDto))]
[JsonSerializable(typeof(Result<BabyDto>))]
[JsonSerializable(typeof(List<BabyDto>))]
[JsonSerializable(typeof(Result<List<BabyDto>>))]

// ExcretionLog
[JsonSerializable(typeof(ExcretionLogDto))]
[JsonSerializable(typeof(CreateExcretionLogDto))]
[JsonSerializable(typeof(UpdateExcretionLogDto))]
[JsonSerializable(typeof(Result<ExcretionLogDto>))]
[JsonSerializable(typeof(List<ExcretionLogDto>))]
[JsonSerializable(typeof(Result<List<ExcretionLogDto>>))]

// FeedingLog
[JsonSerializable(typeof(FeedingLogDto))]
[JsonSerializable(typeof(CreateFeedingLogDto))]
[JsonSerializable(typeof(UpdateFeedingLogDto))]
[JsonSerializable(typeof(DailyFeedingSummaryDto))]
[JsonSerializable(typeof(NextFeedingDto))]
[JsonSerializable(typeof(Result<FeedingLogDto>))]
[JsonSerializable(typeof(List<FeedingLogDto>))]
[JsonSerializable(typeof(Result<List<FeedingLogDto>>))]
[JsonSerializable(typeof(Result<DailyFeedingSummaryDto>))]
[JsonSerializable(typeof(Result<NextFeedingDto>))]

// GrowthLog
[JsonSerializable(typeof(GrowthLogDto))]
[JsonSerializable(typeof(CreateGrowthLogDto))]
[JsonSerializable(typeof(UpdateGrowthLogDto))]
[JsonSerializable(typeof(Result<GrowthLogDto>))]
[JsonSerializable(typeof(List<GrowthLogDto>))]
[JsonSerializable(typeof(Result<List<GrowthLogDto>>))]

// Logs
[JsonSerializable(typeof(LogEntryDto))]
[JsonSerializable(typeof(FeedingDetailsDto))]
[JsonSerializable(typeof(GrowthDetailsDto))]
[JsonSerializable(typeof(List<LogEntryDto>))]
[JsonSerializable(typeof(PaginatedLogResponse))]
[JsonSerializable(typeof(Result<PaginatedLogResponse>))]
[JsonSerializable(typeof(Result<List<LogEntryDto>>))]

// User
[JsonSerializable(typeof(UserContextDto))]
[JsonSerializable(typeof(Result<UserContextDto>))]

// Generic types
[JsonSerializable(typeof(FeedingType))]
[JsonSerializable(typeof(ExcretionType))]
[JsonSerializable(typeof(LogType))]
[JsonSerializable(typeof(FamilyRole))]
[JsonSerializable(typeof(string))]

// AWS Lambda Types
[JsonSerializable(typeof(Amazon.Lambda.APIGatewayEvents.APIGatewayHttpApiV2ProxyRequest))]
[JsonSerializable(typeof(Amazon.Lambda.APIGatewayEvents.APIGatewayHttpApiV2ProxyResponse))]

public partial class ApiJsonSerializerContext : JsonSerializerContext
{
}
