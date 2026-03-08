'use client';

import { useState, useEffect, useMemo } from 'react';
import { growthService } from '@/lib/services/growth/growth.service.client';
import type { GrowthLog } from '@/lib/types';
import { TZDate } from '@date-fns/tz';
import { differenceInDays, format } from 'date-fns';

interface UseLatestGrowthReturn {
  latestGrowth: GrowthLog | null;
  latestGrowthWording: string | null;
  loading: boolean;
}

export function useLatestGrowth(babyId: string, babyTimeZone?: string): UseLatestGrowthReturn {
  const [latestGrowth, setLatestGrowth] = useState<GrowthLog | null>(null);
  const [loading, setLoading] = useState(true);

  const latestGrowthWording = useMemo(() => {
    if (!latestGrowth) return null;

    const dataString = `${latestGrowth.weightKg}kg${latestGrowth.heightCm ? ` / ${latestGrowth.heightCm}cm` : ""}`;
    const timeZoneToUse = babyTimeZone || 'Pacific/Auckland';
    
    if (!latestGrowth.localDate) {
      return dataString;
    }

    const recordDate = new TZDate(`${latestGrowth.localDate}T00:00:00`, timeZoneToUse);
    const today = new TZDate(new Date(), timeZoneToUse);

    const startOfToday = new TZDate(`${format(today, 'yyyy-MM-dd')}T00:00:00`, timeZoneToUse);
    const diffDays = differenceInDays(startOfToday, recordDate);

    if (diffDays === 0) {
        return `Today: ${dataString}`;
    } else if (diffDays === 1) {
        return `Yesterday: ${dataString}`;
    } else if (diffDays <= 15) {
        return `${diffDays} days ago: ${dataString}`;
    } else {
        return `${format(recordDate, 'dd MMM')}: ${dataString}`;
    }

  }, [latestGrowth, babyTimeZone]);

  useEffect(() => {
    let cancelled = false;

    async function fetchLatestGrowth() {
      try {
        const results = await growthService.getAll(babyId, undefined, 1);
        if (!cancelled) {
          if (results && results.length > 0) {
            setLatestGrowth(results[0]);
          } else {
            setLatestGrowth(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch latest growth:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLatestGrowth();

    return () => {
      cancelled = true;
    };
  }, [babyId]);

  return { latestGrowth, latestGrowthWording, loading };
}
