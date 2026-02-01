using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetAllFeedingLogs;

public record GetAllFeedingLogsQuery : IRequest<Result<List<FeedingLogDto>>>;

internal sealed class GetAllFeedingLogsQueryHandler(IFeedingRepository feedingRepository, IMapper mapper)
    : IRequestHandler<GetAllFeedingLogsQuery, Result<List<FeedingLogDto>>>
{
    public async Task<Result<List<FeedingLogDto>>> Handle(GetAllFeedingLogsQuery request, CancellationToken cancellationToken)
    {
        var logs = await feedingRepository.GetAllAsync();
        var dtos = mapper.Map<List<FeedingLogDto>>(logs);
        return Result<List<FeedingLogDto>>.Success(dtos);
    }
}
