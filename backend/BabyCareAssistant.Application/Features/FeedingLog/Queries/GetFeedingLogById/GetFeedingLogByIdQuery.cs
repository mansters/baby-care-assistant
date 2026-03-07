using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogById;

public record GetFeedingLogByIdQuery(string BabyId, string Sk) : IRequest<Result<FeedingLogDto>>;

internal sealed class GetFeedingLogByIdQueryHandler(IFeedingRepository feedingRepository, IMapper mapper)
    : IRequestHandler<GetFeedingLogByIdQuery, Result<FeedingLogDto>>
{
    public async Task<Result<FeedingLogDto>> Handle(GetFeedingLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await feedingRepository.GetByKeyAsync(request.BabyId, request.Sk, cancellationToken);

        if (log == null)
        {
            return Result<FeedingLogDto>.Failure("Feeding log not found");
        }

        var dto = mapper.Map<FeedingLogDto>(log);
        return Result<FeedingLogDto>.Success(dto);
    }
}
