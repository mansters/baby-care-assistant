using Microsoft.Extensions.DependencyInjection;
using MediatR;
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
        // Baby Handlers
        services.AddTransient<IRequestHandler<CreateBabyCommand, Result<BabyDto>>, CreateBabyCommandHandler>();
        services.AddTransient<IRequestHandler<UpdateBabyCommand, Result<BabyDto>>, UpdateBabyCommandHandler>();
        services.AddTransient<IRequestHandler<DeleteBabyCommand, Result>, DeleteBabyCommandHandler>();
        services.AddTransient<IRequestHandler<GetBabyByIdQuery, Result<BabyDto>>, GetBabyByIdQueryHandler>();
        services.AddTransient<IRequestHandler<GetBabiesByFamilyIdQuery, Result<List<BabyDto>>>, GetBabiesByFamilyIdQueryHandler>();

        // FeedingLog Handlers
        services.AddTransient<IRequestHandler<CreateFeedingLogCommand, Result<FeedingLogDto>>, CreateFeedingLogCommandHandler>();
        services.AddTransient<IRequestHandler<UpdateFeedingLogCommand, Result<FeedingLogDto>>, UpdateFeedingLogCommandHandler>();
        services.AddTransient<IRequestHandler<DeleteFeedingLogCommand, Result>, DeleteFeedingLogCommandHandler>();
        services.AddTransient<IRequestHandler<GetFeedingLogByIdQuery, Result<FeedingLogDto>>, GetFeedingLogByIdQueryHandler>();
        services.AddTransient<IRequestHandler<GetNextFeedingQuery, Result<NextFeedingDto>>, GetNextFeedingQueryHandler>();
        services.AddTransient<IRequestHandler<GetFeedingLogsByBabyIdQuery, Result<List<FeedingLogDto>>>, GetFeedingLogsByBabyIdQueryHandler>();
        services.AddTransient<IRequestHandler<GetDailyFeedingSummaryQuery, Result<DailyFeedingSummaryDto>>, GetDailyFeedingSummaryQueryHandler>();

        // GrowthLog Handlers
        services.AddTransient<IRequestHandler<CreateGrowthLogCommand, Result<GrowthLogDto>>, CreateGrowthLogCommandHandler>();
        services.AddTransient<IRequestHandler<UpdateGrowthLogCommand, Result<GrowthLogDto>>, UpdateGrowthLogCommandHandler>();
        services.AddTransient<IRequestHandler<DeleteGrowthLogCommand, Result>, DeleteGrowthLogCommandHandler>();
        services.AddTransient<IRequestHandler<GetGrowthLogByIdQuery, Result<GrowthLogDto>>, GetGrowthLogByIdQueryHandler>();
        services.AddTransient<IRequestHandler<GetGrowthLogsByBabyIdQuery, Result<List<GrowthLogDto>>>, GetGrowthLogsByBabyIdQueryHandler>();

        // ExcretionLog Handlers
        services.AddTransient<IRequestHandler<CreateExcretionLogCommand, Result<ExcretionLogDto>>, CreateExcretionLogCommandHandler>();
        services.AddTransient<IRequestHandler<UpdateExcretionLogCommand, Result<ExcretionLogDto>>, UpdateExcretionLogCommandHandler>();
        services.AddTransient<IRequestHandler<DeleteExcretionLogCommand, Result>, DeleteExcretionLogCommandHandler>();
        services.AddTransient<IRequestHandler<GetExcretionLogByIdQuery, Result<ExcretionLogDto>>, GetExcretionLogByIdQueryHandler>();
        services.AddTransient<IRequestHandler<GetExcretionLogsByBabyIdQuery, Result<List<ExcretionLogDto>>>, GetExcretionLogsByBabyIdQueryHandler>();

        // Users
        services.AddTransient<IRequestHandler<GetUserContextQuery, Result<UserContextDto>>, GetUserContextQueryHandler>();

        // Logs
        services.AddTransient<IRequestHandler<GetLogsQuery, Result<PaginatedLogResponse>>, GetLogsQueryHandler>();

        return services;
    }
}
