using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.FeedingLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries;

public record GetFeedingLogByIdQuery(Guid Id) : IRequest<Result<FeedingLogDto>>;

public class GetFeedingLogByIdQueryHandler(IFeedingRepository feedingRepository, IMapper mapper)
    : IRequestHandler<GetFeedingLogByIdQuery, Result<FeedingLogDto>>
{
    public async Task<Result<FeedingLogDto>> Handle(GetFeedingLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await feedingRepository.GetByIdAsync(request.Id);

        if (log == null)
        {
            return Result<FeedingLogDto>.Failure("Feeding log not found");
        }

        var dto = mapper.Map<FeedingLogDto>(log);
        return Result<FeedingLogDto>.Success(dto);
    }
}
