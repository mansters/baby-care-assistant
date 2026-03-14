using BabyCareAssistant.Application.Features.Log.Dtos;
using BabyCareAssistant.Application.Features.Log.Queries.GetLogs;
using BabyCareAssistant.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Endpoints;

public static class LogEndpoints
{
    public static void MapLogEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/Log").RequireAuthorization();

        group.MapGet("", async (
            [FromQuery] string babyId,
            [FromQuery] string? cursor,
            [FromQuery] int? pageSize,
            [FromQuery] LogType[]? types,
            ISender sender) =>
        {
            var result = await sender.Send(new GetLogsQuery(babyId, cursor, pageSize ?? 20, types));
            return Results.Ok(result.Value);
        });
    }
}
