'use client';

import { useState, useEffect } from 'react';
import { feedingService } from '@/lib/services/feeding/feeding.service.client';
import { useTimezone } from '@/lib/contexts/timezone.context';
import { formatLocalDate } from '@/lib/utils/datetime';

interface UseNextFeedingReturn {
  lastFeedingDisplay: string | null;
  nextFeedingDisplay: string | null;
  predictedAmountMl: number | null;
  loading: boolean;
}

export function useNextFeeding(babyId: string): UseNextFeedingReturn {
  const { timeZoneId } = useTimezone();
  const [lastFeedingDisplay, setLastFeedingDisplay] = useState<string | null>(null);
  const [nextFeedingDisplay, setNextFeedingDisplay] = useState<string | null>(null);
  const [predictedAmountMl, setPredictedAmountMl] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchNextFeeding() {
      try {
        const result = await feedingService.getNextFeeding(babyId);
        if (!cancelled) {
          setLastFeedingDisplay(
            result.lastFeedingTime
              ? formatLocalDate(result.lastFeedingTime, 'HH:mm', timeZoneId)
              : null
          );
          setNextFeedingDisplay(
            result.nextFeedingTime
              ? formatLocalDate(result.nextFeedingTime, 'HH:mm', timeZoneId)
              : null
          );
          setPredictedAmountMl(result.predictedAmountMl ?? null);
        }
      } catch (error) {
        console.error('Failed to fetch next feeding:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNextFeeding();

    return () => {
      cancelled = true;
    };
  }, [babyId, timeZoneId]);

  return { lastFeedingDisplay, nextFeedingDisplay, predictedAmountMl, loading };
}
