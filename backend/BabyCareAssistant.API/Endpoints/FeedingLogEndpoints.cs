using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.DeleteFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogsByBabyId;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogById;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetDailyFeedingSummary;
using BabyCareAssistant.Application.Features.FeedingLog.Queries.GetNextFeeding;
using MediatR;
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

        group.MapGet("", async ([FromQuery] string babyId, [FromQuery] string? cursorSk, [FromQuery] int? limit, ISender sender) =>
        {
            var result = await sender.Send(new GetFeedingLogsByBabyIdQuery(babyId, cursorSk, limit ?? 20));
            return Results.Ok(result.Value);
        });

        group.MapGet("item", async ([FromQuery] string babyId, [FromQuery] string sk, ISender sender) =>
        {
            var result = await sender.Send(new GetFeedingLogByIdQuery(babyId, sk));
            if (!result.IsSuccess) return Results.NotFound();
            return Results.Ok(result.Value);
        }).WithName("GetFeedingLogByIdAsync");

        group.MapPost("", async ([FromBody] CreateFeedingLogDto request, ISender sender) =>
        {
            var result = await sender.Send(new CreateFeedingLogCommand(request));
            return Results.CreatedAtRoute("GetFeedingLogByIdAsync", new { babyId = result.Value!.BabyId, sk = result.Value.SK }, result.Value);
        });

        group.MapPut("item", async ([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateFeedingLogDto request, ISender sender) =>
        {
            var result = await sender.Send(new UpdateFeedingLogCommand(babyId, sk, request));
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

        group.MapDelete("item", async ([FromQuery] string babyId, [FromQuery] string sk, ISender sender) =>
        {
            await sender.Send(new DeleteFeedingLogCommand(babyId, sk));
            return Results.NoContent();
        });

        group.MapGet("daily-summary", async ([FromQuery] string babyId, ISender sender) =>
        {
            var result = await sender.Send(new GetDailyFeedingSummaryQuery(babyId));
            return Results.Ok(result.Value);
        });

        group.MapGet("next-feeding", async ([FromQuery] string babyId, ISender sender) =>
        {
            var result = await sender.Send(new GetNextFeedingQuery(babyId));
            return Results.Ok(result.Value);
        });
    }
}
