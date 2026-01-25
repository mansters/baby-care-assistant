'use client';

import { useMemo } from 'react';
import { GrowthLog } from '@/lib/api-client';
import { format } from 'date-fns';

export interface MonthGroup {
    monthKey: string;
    date: Date;
    logs: GrowthLog[];
    weightChange: number | null;
}

/**
 * Custom hook to group GrowthLogs by month and calculate weight changes.
 * @param logs Array of GrowthLog entries
 * @returns Array of MonthGroup objects sorted by date descending
 */
export function useGroupedLogs(logs: GrowthLog[]): MonthGroup[] {
    return useMemo(() => {
        // Sort logs by date descending
        const sortedLogs = [...logs].sort(
            (a, b) => new Date(b.dateMeasured).getTime() - new Date(a.dateMeasured).getTime()
        );

        // Group by month using Record for O(1) lookup
        const groupMap: Record<string, MonthGroup> = {};

        sortedLogs.forEach(log => {
            const date = new Date(log.dateMeasured);
            const monthKey = format(date, 'yyyy-MM');

            if (groupMap[monthKey]) {
                groupMap[monthKey].logs.push(log);
            } else {
                groupMap[monthKey] = { monthKey, date, logs: [log], weightChange: null };
            }
        });

        // Convert to array (already sorted since we iterated in order)
        const groups = Object.values(groupMap);

        // Calculate weight change between consecutive months
        for (let i = 0; i < groups.length; i++) {
            const currentGroup = groups[i];
            const previousGroup = groups[i + 1];

            if (previousGroup) {
                const currentMonthLatestWeight = currentGroup.logs[0].weightKg;
                const previousMonthLatestWeight = previousGroup.logs[0].weightKg;
                currentGroup.weightChange = currentMonthLatestWeight - previousMonthLatestWeight;
            }
        }

        return groups;
    }, [logs]);
}
