using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Domain.Services;

public class PredictionResult
{
    public double NextAmountMl { get; set; }
    public DateTime NextFeedingTime { get; set; }
}

public class FeedingPredictionService
{
    public PredictionResult PredictNextFeeding(List<FeedingLog> recentLogs, GrowthLog? latestGrowth)
    {
        var sortedLogs = recentLogs.OrderBy(l => l.EventTimeUtc).ToList();
        
        // 1. Calculate base weight (default newborn fallback if missing)
        double weightKg = latestGrowth != null && latestGrowth.WeightKg > 0 
            ? (double)latestGrowth.WeightKg 
            : 3.5; 
            
        // 2. Identify Tier 3 (Cold Start: no history at all)
        if (!sortedLogs.Any())
        {
            double defaultVStd = (weightKg * 165.0) / 8.0;
            return new PredictionResult 
            {
                NextAmountMl = Math.Round(defaultVStd),
                NextFeedingTime = DateTime.UtcNow.AddHours(3.0)
            };
        }

        var firstLog = sortedLogs.First();
        var lastLog = sortedLogs.Last();
        // Fallback age to safety if only 1 log exists (age=0)
        var ageOfDataHours = (lastLog.EventTimeUtc - firstLog.EventTimeUtc).TotalHours;

        double alpha = 0;
        double avgDailyFeedingCount = 8.0;

        if (ageOfDataHours < 24)
        {
            // Tier 3: Less than 24h data
            alpha = 0;
            avgDailyFeedingCount = 8.0;
        }
        else if (ageOfDataHours >= 24 && ageOfDataHours <= 72)
        {
            // Tier 2: 24h to 72h
            alpha = 0.4;
            avgDailyFeedingCount = sortedLogs.Count / (ageOfDataHours / 24.0);
        }
        else
        {
            // Tier 1: > 72h
            alpha = 0.8;
            avgDailyFeedingCount = sortedLogs.Count / (ageOfDataHours / 24.0);
        }

        // Amount Prediction Phase
        double vStd = (weightKg * 165.0) / avgDailyFeedingCount;
        double vHist = sortedLogs.Average(l => l.AmountMl);
        
        double vPred = (alpha * vHist) + ((1 - alpha) * vStd);
        
        // Safety Bound: Clamp vPred to +/- 30% of vStd
        double lowerBoundAmt = vStd * 0.7;
        double upperBoundAmt = vStd * 1.3;
        vPred = Math.Clamp(vPred, lowerBoundAmt, upperBoundAmt);

        // Time Prediction Phase
        double iNext = 3.0;
        
        double tTotal = ageOfDataHours;
        if (tTotal > 0 && ageOfDataHours >= 24) // Need valid spread to calc digestion rate
        {
            double vTotal = sortedLogs.Sum(l => l.AmountMl);
            double digestionRate = vTotal / tTotal;
            if (digestionRate > 0)
            {
                double vLast = lastLog.AmountMl;
                iNext = vLast / digestionRate;
            }
        }
        
        // Safety Bound: Clamp iNext to 1.5 - 4.5 hours
        iNext = Math.Clamp(iNext, 1.5, 4.5);
        var nextFeedingTime = lastLog.EventTimeUtc.AddHours(iNext);

        return new PredictionResult 
        { 
            NextAmountMl = Math.Round(vPred), 
            NextFeedingTime = nextFeedingTime 
        };
    }
}
