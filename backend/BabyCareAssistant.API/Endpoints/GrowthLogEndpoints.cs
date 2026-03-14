using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.DeleteGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogById;
using BabyCareAssistant.Application.Features.GrowthLog.Queries.GetGrowthLogsByBabyId;
using MediatR;
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

        group.MapGet("", async ([FromQuery] string babyId, [FromQuery] string? cursorSk, [FromQuery] int? limit, ISender sender) =>
        {
            var result = await sender.Send(new GetGrowthLogsByBabyIdQuery(babyId, cursorSk, limit ?? 20));
            return Results.Ok(result.Value);
        });

        group.MapGet("item", async ([FromQuery] string babyId, [FromQuery] string sk, ISender sender) =>
        {
            var result = await sender.Send(new GetGrowthLogByIdQuery(babyId, sk));
            return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
        }).WithName("GetGrowthLogByIdAsync");

        group.MapPost("", async ([FromBody] CreateGrowthLogDto request, ISender sender) =>
        {
            var result = await sender.Send(new CreateGrowthLogCommand(request));
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        });

        group.MapPut("item", async ([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateGrowthLogDto request, ISender sender) =>
        {
            var result = await sender.Send(new UpdateGrowthLogCommand(babyId, sk, request));
            return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
        });

        group.MapDelete("item", async ([FromQuery] string babyId, [FromQuery] string sk, ISender sender) =>
        {
            var result = await sender.Send(new DeleteGrowthLogCommand(babyId, sk));
            return result.IsSuccess ? Results.NoContent() : Results.BadRequest(result.Error);
        });
    }
}
