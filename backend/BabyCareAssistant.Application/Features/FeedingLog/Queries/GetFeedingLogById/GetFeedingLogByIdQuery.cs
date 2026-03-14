using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
using MediatR;
namespace BabyCareAssistant.Application.Features.FeedingLog.Queries.GetFeedingLogById;

public record GetFeedingLogByIdQuery(string BabyId, string Sk) : IRequest<Result<FeedingLogDto>>;

internal sealed class GetFeedingLogByIdQueryHandler(IFeedingRepository feedingRepository)
    : IRequestHandler<GetFeedingLogByIdQuery, Result<FeedingLogDto>>
{
    public async Task<Result<FeedingLogDto>> Handle(GetFeedingLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await feedingRepository.GetByKeyAsync(request.BabyId, request.Sk, cancellationToken);

        if (log == null)
        {
            return Result<FeedingLogDto>.Failure("Feeding log not found");
        }

        var dto = log.ToDto();
        return Result<FeedingLogDto>.Success(dto);
    }
}
