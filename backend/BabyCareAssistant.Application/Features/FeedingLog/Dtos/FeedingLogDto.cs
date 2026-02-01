using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.FeedingLog.Dtos;

public record FeedingLogDto(
    Guid Id,
    Guid BabyId,
    DateTime FeedingTime,   
    int? DurationMinutes,    
    FeedingType Type,            
    int AmountMl,
    string? Note
);
