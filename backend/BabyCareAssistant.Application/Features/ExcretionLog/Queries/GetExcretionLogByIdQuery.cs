using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.ExcretionLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Queries;

public record GetExcretionLogByIdQuery(Guid Id) : IRequest<Result<ExcretionLogDto>>;

public class GetExcretionLogByIdQueryHandler(IExcretionLogRepository excretionLogRepository, IMapper mapper)
    : IRequestHandler<GetExcretionLogByIdQuery, Result<ExcretionLogDto>>
{
    public async Task<Result<ExcretionLogDto>> Handle(GetExcretionLogByIdQuery request, CancellationToken cancellationToken)
    {
        var log = await excretionLogRepository.GetByIdAsync(request.Id);

        if (log == null)
        {
            return Result<ExcretionLogDto>.Failure("Excretion log not found");
        }

        var dto = mapper.Map<ExcretionLogDto>(log);
        return Result<ExcretionLogDto>.Success(dto);
    }
}
