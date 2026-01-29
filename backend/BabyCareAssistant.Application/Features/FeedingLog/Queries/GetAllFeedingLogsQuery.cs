using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.FeedingLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries;

public record GetAllFeedingLogsQuery : IRequest<Result<List<FeedingLogDto>>>;

public class GetAllFeedingLogsQueryHandler(IFeedingRepository feedingRepository, IMapper mapper)
    : IRequestHandler<GetAllFeedingLogsQuery, Result<List<FeedingLogDto>>>
{
    public async Task<Result<List<FeedingLogDto>>> Handle(GetAllFeedingLogsQuery request, CancellationToken cancellationToken)
    {
        var logs = await feedingRepository.GetAllAsync();
        var dtos = mapper.Map<List<FeedingLogDto>>(logs);
        return Result<List<FeedingLogDto>>.Success(dtos);
    }
}
