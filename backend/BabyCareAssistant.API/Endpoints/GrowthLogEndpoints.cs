using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.DeleteGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogById;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogsByBabyId;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Endpoints;

public static class GrowthLogEndpoints
{
    public static void MapGrowthLogEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/GrowthLog").RequireAuthorization();

        group.MapGet("", async ([FromQuery] string babyId, [FromQuery] string? cursorSk, [FromQuery] int? limit, GetGrowthLogsByBabyIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetGrowthLogsByBabyIdQuery(babyId, cursorSk, limit ?? 20), default);
            return Results.Ok(result.Value);
        });

        group.MapGet("item", async ([FromQuery] string babyId, [FromQuery] string sk, GetGrowthLogByIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetGrowthLogByIdQuery(babyId, sk), default);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        }).WithName("GetGrowthLogByIdAsync");

        group.MapPost("", async ([FromBody] CreateGrowthLogDto request, CreateGrowthLogCommandHandler handler) =>
        {
            var result = await handler.Handle(new CreateGrowthLogCommand(request), default);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        });

        group.MapPut("item", async ([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateGrowthLogDto request, UpdateGrowthLogCommandHandler handler) =>
        {
            var result = await handler.Handle(new UpdateGrowthLogCommand(babyId, sk, request), default);
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        });

        group.MapDelete("item", async ([FromQuery] string babyId, [FromQuery] string sk, DeleteGrowthLogCommandHandler handler) =>
        {
            var result = await handler.Handle(new DeleteGrowthLogCommand(babyId, sk), default);
            return result.IsSuccess ? Results.NoContent() : Results.BadRequest(result.Error);
        });
    }
}
