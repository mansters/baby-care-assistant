using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.DeleteExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogsByBabyId;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogById;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Endpoints;

public static class ExcretionLogEndpoints
{
    public static void MapExcretionLogEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/ExcretionLog").RequireAuthorization();

        group.MapGet("", async ([FromQuery] string babyId, [FromQuery] string? cursorSk, [FromQuery] int? limit, GetExcretionLogsByBabyIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetExcretionLogsByBabyIdQuery(babyId, cursorSk, limit ?? 20), default);
            return Results.Ok(result.Value);
        });

        group.MapGet("item", async ([FromQuery] string babyId, [FromQuery] string sk, GetExcretionLogByIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetExcretionLogByIdQuery(babyId, sk), default);
            if (!result.IsSuccess) return Results.NotFound();
            return Results.Ok(result.Value);
        }).WithName("GetExcretionLogByIdAsync");

        group.MapPost("", async ([FromBody] CreateExcretionLogDto request, CreateExcretionLogCommandHandler handler) =>
        {
            var result = await handler.Handle(new CreateExcretionLogCommand(request), default);
            return Results.CreatedAtRoute("GetExcretionLogByIdAsync", new { babyId = result.Value!.BabyId, sk = result.Value.SK }, result.Value);
        });

        group.MapPut("item", async ([FromQuery] string babyId, [FromQuery] string sk, [FromBody] UpdateExcretionLogDto request, UpdateExcretionLogCommandHandler handler) =>
        {
            var result = await handler.Handle(new UpdateExcretionLogCommand(babyId, sk, request), default);
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

        group.MapDelete("item", async ([FromQuery] string babyId, [FromQuery] string sk, DeleteExcretionLogCommandHandler handler) =>
        {
            await handler.Handle(new DeleteExcretionLogCommand(babyId, sk), default);
            return Results.NoContent();
        });
    }
}
