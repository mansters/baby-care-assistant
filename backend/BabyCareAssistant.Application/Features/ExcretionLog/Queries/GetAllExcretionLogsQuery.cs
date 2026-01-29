using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.ExcretionLog;
using BabyCareAssistant.Application.Interfaces;
using AutoMapper;
using MediatR;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Queries;

public record GetAllExcretionLogsQuery : IRequest<Result<List<ExcretionLogDto>>>;

public class GetAllExcretionLogsQueryHandler(IExcretionLogRepository excretionLogRepository, IMapper mapper)
    : IRequestHandler<GetAllExcretionLogsQuery, Result<List<ExcretionLogDto>>>
{
    public async Task<Result<List<ExcretionLogDto>>> Handle(GetAllExcretionLogsQuery request, CancellationToken cancellationToken)
    {
        var logs = await excretionLogRepository.GetAllAsync();
        var dtos = mapper.Map<List<ExcretionLogDto>>(logs);
        return Result<List<ExcretionLogDto>>.Success(dtos);
    }
}
