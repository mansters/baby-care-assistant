using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.DeleteBaby;
using BabyCareAssistant.Application.Features.Baby.Queries.GetBabiesByFamilyId;
using BabyCareAssistant.Application.Features.Baby.Queries.GetBabyById;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Endpoints;

public static class BabyEndpoints
{
    public static void MapBabyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/Baby").RequireAuthorization();

        group.MapGet("", async ([FromQuery] string familyId, GetBabiesByFamilyIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetBabiesByFamilyIdQuery(familyId), default);
            return Results.Ok(result.Value);
        });

        group.MapGet("item", async ([FromQuery] string id, GetBabyByIdQueryHandler handler) =>
        {
            var result = await handler.Handle(new GetBabyByIdQuery(id), default);
            if (!result.IsSuccess) return Results.NotFound();
            return Results.Ok(result.Value);
        }).WithName("GetBabyByIdAsync");

        group.MapPost("", async ([FromBody] CreateBabyDto request, CreateBabyCommandHandler handler) =>
        {
            var result = await handler.Handle(new CreateBabyCommand(request), default);
            return Results.CreatedAtRoute("GetBabyByIdAsync", new { id = result.Value!.Id }, result.Value);
        });

        group.MapPut("item", async ([FromQuery] string id, [FromBody] UpdateBabyDto request, UpdateBabyCommandHandler handler) =>
        {
            var result = await handler.Handle(new UpdateBabyCommand(id, request), default);
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

        group.MapDelete("item", async ([FromQuery] string id, DeleteBabyCommandHandler handler) =>
        {
            await handler.Handle(new DeleteBabyCommand(id), default);
            return Results.NoContent();
        });
    }
}
