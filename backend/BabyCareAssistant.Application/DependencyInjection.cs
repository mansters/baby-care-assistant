using Microsoft.Extensions.DependencyInjection;

using System.Collections.Generic;
using BabyCareAssistant.Application.Common;

// Baby
using BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.DeleteBaby;
using BabyCareAssistant.Application.Features.Baby.Queries.GetBabyById;
using BabyCareAssistant.Application.Features.Baby.Queries.GetBabiesByFamilyId;
using BabyCareAssistant.Application.Features.Baby.Dtos;

// FeedingLog
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.DeleteFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogById;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetNextFeeding;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogsByBabyId;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetDailyFeedingSummary;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;

// GrowthLog
using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.DeleteGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogById;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogsByBabyId;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;

// ExcretionLog
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.DeleteExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogById;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogsByBabyId;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;

// Users
using BabyCareAssistant.Application.Features.Users.Queries.GetUserContext;

// Logs
using BabyCareAssistant.Application.Features.Log.Queries.GetLogs;
using BabyCareAssistant.Application.Features.Log.Dtos;

namespace BabyCareAssistant.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Baby Services
        services.AddTransient<CreateBabyCommandHandler>();
        services.AddTransient<UpdateBabyCommandHandler>();
        services.AddTransient<DeleteBabyCommandHandler>();
        services.AddTransient<GetBabyByIdQueryHandler>();
        services.AddTransient<GetBabiesByFamilyIdQueryHandler>();

        // FeedingLog Services
        services.AddTransient<CreateFeedingLogCommandHandler>();
        services.AddTransient<UpdateFeedingLogCommandHandler>();
        services.AddTransient<DeleteFeedingLogCommandHandler>();
        services.AddTransient<GetFeedingLogByIdQueryHandler>();
        services.AddTransient<GetNextFeedingQueryHandler>();
        services.AddTransient<GetFeedingLogsByBabyIdQueryHandler>();
        services.AddTransient<GetDailyFeedingSummaryQueryHandler>();

        // GrowthLog Services
        services.AddTransient<CreateGrowthLogCommandHandler>();
        services.AddTransient<UpdateGrowthLogCommandHandler>();
        services.AddTransient<DeleteGrowthLogCommandHandler>();
        services.AddTransient<GetGrowthLogByIdQueryHandler>();
        services.AddTransient<GetGrowthLogsByBabyIdQueryHandler>();

        // ExcretionLog Services
        services.AddTransient<CreateExcretionLogCommandHandler>();
        services.AddTransient<UpdateExcretionLogCommandHandler>();
        services.AddTransient<DeleteExcretionLogCommandHandler>();
        services.AddTransient<GetExcretionLogByIdQueryHandler>();
        services.AddTransient<GetExcretionLogsByBabyIdQueryHandler>();

        // Users
        services.AddTransient<GetUserContextQueryHandler>();

        // Logs
        services.AddTransient<GetLogsQueryHandler>();

        return services;
    }
}
