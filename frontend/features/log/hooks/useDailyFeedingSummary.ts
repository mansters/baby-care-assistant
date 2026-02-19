'use client';

import { useState, useEffect } from 'react';
import { feedingService } from '@/lib/services/feeding/feeding.service.client';
import { useTimezone } from '@/lib/contexts/timezone.context';
import type { DailyFeedingInfo } from '@/lib/services/feeding/feeding.service';

interface UseDailyFeedingSummaryReturn {
  dailyTotals: Record<string, DailyFeedingInfo>;
  loading: boolean;
}

export function useDailyFeedingSummary(babyId: string): UseDailyFeedingSummaryReturn {
  const { timeZoneId } = useTimezone();
  const [dailyTotals, setDailyTotals] = useState<Record<string, DailyFeedingInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSummary() {
      try {
        const result = await feedingService.getDailyFeedingSummary(babyId, timeZoneId);
        if (!cancelled) {
          setDailyTotals(result.dailyTotals);
        }
      } catch (error) {
        console.error('Failed to fetch daily feeding summary:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSummary();

    return () => {
      cancelled = true;
    };
  }, [babyId, timeZoneId]);

  return { dailyTotals, loading };
}


