using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.DeleteFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogsByBabyId;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogById;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetDailyFeedingSummary;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetNextFeeding;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Endpoints;

public static class FeedingLogEndpoints
{
    public static void MapFeedingLogEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/Feeding").RequireAuthorization();

        group.MapGet("", async ([FromQuery] string babyId, [FromQuery] string? cursorSk, [FromQuery] int? limit, GetFeedingLogsByBabyIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetFeedingLogsByBabyIdQuery(babyId, cursorSk, limit ?? 20), default);
            return Results.Ok(result.Value);
        });

        group.MapGet("item", async ([FromQuery] string babyId, [FromQuery] string sk, GetFeedingLogByIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetFeedingLogByIdQuery(babyId, sk), default);
            if (!result.IsSuccess) return Results.NotFound();
            return Results.Ok(result.Value);
        }).WithName("GetFeedingLogByIdAsync");

        group.MapPost("", async ([FromBody] CreateFeedingLogDto request, CreateFeedingLogCommandHandler handler) =>
        {
            var result = await handler.Handle(new CreateFeedingLogCommand(request), default);
            return Results.CreatedAtRoute("GetFeedingLogByIdAsync", new { babyId = result.Value!.BabyId, sk = result.Value.SK }, result.Value);
        });

        group.MapPut("item", async ([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateFeedingLogDto request, UpdateFeedingLogCommandHandler handler) =>
        {
            var result = await handler.Handle(new UpdateFeedingLogCommand(babyId, sk, request), default);
            if (!result.IsSuccess)
            {
                if (result.Error == "The ID in the URL does not match the ID in the request body.")
                {
                    return Results.BadRequest(result.Error);
                }
                return Results.NotFound();
            }
            return Results.Ok(result.Value);
        });

        group.MapDelete("item", async ([FromQuery] string babyId, [FromQuery] string sk, DeleteFeedingLogCommandHandler handler) =>
        {
            await handler.Handle(new DeleteFeedingLogCommand(babyId, sk), default);
            return Results.NoContent();
        });

        group.MapGet("daily-summary", async ([FromQuery] string babyId, GetDailyFeedingSummaryQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetDailyFeedingSummaryQuery(babyId), default);
            return Results.Ok(result.Value);
        });

        group.MapGet("next-feeding", async ([FromQuery] string babyId, GetNextFeedingQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetNextFeedingQuery(babyId), default);
            return Results.Ok(result.Value);
        });
    }
}
