using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.API.Dtos;

public record FeedingLogDto(
    Guid Id,
    Guid BabyId,
    DateTime FeedingTime,   
    int? DurationMinutes,    
    FeedingType Type,            
    int AmountMl            
);