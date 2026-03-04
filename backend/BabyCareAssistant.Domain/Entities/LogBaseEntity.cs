using NUlid;

namespace BabyCareAssistant.Domain.Entities;

public abstract class LogBaseEntity : DynamoBaseEntity
{
    public string BabyId { get; set; } = string.Empty;
    public DateTime EventTimeUtc { get; set; }
    
    public string LocalDate { get; set; } = string.Empty;
    public string LocalTime { get; set; } = string.Empty;
    public string TimeZone { get; set; } = string.Empty;
    
    protected abstract string LogPrefix { get; }

    public void Initialize(string babyId, DateTime localDateTime, string babyTimeZone)
    {
        if (string.IsNullOrWhiteSpace(babyId))
        {
            throw new ArgumentException("babyId is required.", nameof(babyId));
        }

        if (string.IsNullOrWhiteSpace(babyTimeZone))
        {
            throw new ArgumentException("babyTimeZone is required.", nameof(babyTimeZone));
        }
        
        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(babyTimeZone);
        var unspecifiedLocalTime = DateTime.SpecifyKind(localDateTime, DateTimeKind.Unspecified);
        var utcTime = TimeZoneInfo.ConvertTimeToUtc(unspecifiedLocalTime, timeZoneInfo);
        
        BabyId = babyId;
        PK = $"BABY#{babyId}";
        EventTimeUtc = utcTime;

        var suffix = Ulid.NewUlid().ToString()[^6..];
        SK = $"LOG#{LogPrefix}#{utcTime:yyyy-MM-ddTHH:mm:ss.fffZ}#{suffix}";

        LocalDate = localDateTime.ToString("yyyy-MM-dd");
        LocalTime = localDateTime.ToString("HH:mm:ss");
        TimeZone = babyTimeZone;

        EntityType = GetType().Name;
    }
}