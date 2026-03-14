using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Application.Mappings;
namespace BabyCareAssistant.Application.Features.ExcretionLog.Queries.GetExcretionLogById;

public record GetExcretionLogByIdQuery(string BabyId, string Sk) ;

public sealed class GetExcretionLogByIdQueryHandler(IExcretionLogRepository excretionLogRepository)
{
    public async Task<Result<ExcretionLogDto>> Handle(GetExcretionLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await excretionLogRepository.GetByKeyAsync(request.BabyId, request.Sk, cancellationToken);

        if (log == null)
        {
            return Result<ExcretionLogDto>.Failure("Excretion log not found");
        }

        var dto = log.ToDto();
        return Result<ExcretionLogDto>.Success(dto);
    }
}
