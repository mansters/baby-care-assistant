using BabyCareAssistant.Application.Features.Users.Queries.GetUserContext;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace BabyCareAssistant.API.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/Users").RequireAuthorization();

        group.MapGet("me/context", async (ISender sender) =>
        {
            var result = await sender.Send(new GetUserContextQuery());
            return Results.Ok(result.Value);
        });
    }
}
