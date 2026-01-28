import { useMemo } from 'react';
import { FeedingLog } from '@/lib/api-client';
import { startOfDay } from 'date-fns';

export interface GroupedFeedingLogs {
    date: Date;
    dayKey: string; // ISO date string "YYYY-MM-DD"
    logs: FeedingLog[];
    totalAmount: number;
}

export function useGroupedFeedingLogs(logs: FeedingLog[]): GroupedFeedingLogs[] {
    return useMemo(() => {
        if (!logs || logs.length === 0) return [];

        const groups: Record<string, GroupedFeedingLogs> = {};

        // Sort logs by date descending (newest first)
        const sortedLogs = [...logs].sort((a, b) => 
            new Date(b.feedingTime).getTime() - new Date(a.feedingTime).getTime()
        );

        for (const log of sortedLogs) {
            const date = new Date(log.feedingTime);
            const start = startOfDay(date);
            const dayKey = start.toISOString(); // Use ISO string as unique key

            if (!groups[dayKey]) {
                groups[dayKey] = {
                    date: start,
                    dayKey,
                    logs: [],
                    totalAmount: 0
                };
            }

            groups[dayKey].logs.push(log);
            groups[dayKey].totalAmount += (log.amountMl || 0);
        }

        // Return array of groups, sorted by date descending
        return Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [logs]);
}
