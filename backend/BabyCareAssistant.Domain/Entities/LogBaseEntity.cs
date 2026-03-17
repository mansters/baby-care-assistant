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

    public void Initialize(string babyId, DateTime eventTimeUtc, string babyTimeZone)
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
        
        // Treat incoming eventTime as absolute UTC
        var utcTime = DateTime.SpecifyKind(eventTimeUtc, DateTimeKind.Utc);
        
        // Calculate the local time based on the baby's timezone for accurate representation
        var localDateTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, timeZoneInfo);
        
        BabyId = babyId;
        PK = $"BABY#{babyId}";
        EventTimeUtc = utcTime;

        var suffix = Ulid.NewUlid().ToString()[^6..];
        SK = $"LOG#{utcTime:yyyy-MM-ddTHH:mm:ss.fffZ}#{LogPrefix}#{suffix}";

        // Store the correct calculated local bounds
        LocalDate = localDateTime.ToString("yyyy-MM-dd");
        LocalTime = localDateTime.ToString("HH:mm:ss");
        TimeZone = babyTimeZone;

        EntityType = GetType().Name;
    }

    public void UpdateTime(DateTime newEventTimeUtc)
    {
        var utcTime = DateTime.SpecifyKind(newEventTimeUtc, DateTimeKind.Utc);
        if (utcTime == EventTimeUtc) return;

        // Preserve the existing ULID suffix from the old SK
        var oldSuffix = SK.Split('#').Last();

        EventTimeUtc = utcTime;
        SK = $"LOG#{utcTime:yyyy-MM-ddTHH:mm:ss.fffZ}#{LogPrefix}#{oldSuffix}";

        // Recalculate local time fields based on the baby's timezone
        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(TimeZone);
        var localDateTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, timeZoneInfo);
        LocalDate = localDateTime.ToString("yyyy-MM-dd");
        LocalTime = localDateTime.ToString("HH:mm:ss");
    }
}