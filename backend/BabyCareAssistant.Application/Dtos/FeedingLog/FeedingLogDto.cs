using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Dtos.FeedingLog;

public record FeedingLogDto(
    Guid Id,
    Guid BabyId,
    DateTime FeedingTime,   
    int? DurationMinutes,    
    FeedingType Type,            
    int AmountMl            
);