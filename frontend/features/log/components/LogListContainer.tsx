'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';
import { format, isToday, isYesterday } from 'date-fns';
import { useLogList } from '@/features/log/hooks/useLogList';
import { LogEntry } from '@/features/log/types';
import LogFilterBar from './LogFilterBar';
import LogGroup from './LogGroup';
import LogItem from './LogItem';

interface LogListContainerProps {
  babyId: string;
}

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'TODAY';
  if (isYesterday(date)) return 'YESTERDAY';
  return format(date, 'EEE, MMM d').toUpperCase();
}

function groupByDate(logs: LogEntry[]): Map<string, LogEntry[]> {
  const groups = new Map<string, LogEntry[]>();
  for (const log of logs) {
    const dateKey = format(new Date(log.startTime), 'yyyy-MM-dd');
    const existing = groups.get(dateKey);
    if (existing) {
      existing.push(log);
    } else {
      groups.set(dateKey, [log]);
    }
  }
  return groups;
}

export default function LogListContainer({ babyId }: LogListContainerProps) {
  const router = useRouter();
  const { logs, loading, hasMore, activeFilter, setActiveFilter, sentinelRef } =
    useLogList(babyId);

  const grouped = useMemo(() => groupByDate(logs), [logs]);

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">

      <div className="flex items-center px-4 py-3 bg-white shadow-sm flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 mr-2"
          aria-label="Back"
        >
          <IoArrowBack size={22} className="text-[#364153]" />
        </button>
        <h1 className="text-lg font-bold text-[#364153]">All Logs</h1>
      </div>


      <div className="flex-shrink-0 bg-white border-b border-[#f3f4f6]">
        <LogFilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>


      <div className="flex-1 overflow-y-auto">
        {Array.from(grouped.entries()).map(([dateKey, entries]) => (
          <LogGroup key={dateKey} dateLabel={getDateLabel(entries[0].startTime)}>
            {entries.map((entry) => (
              <LogItem key={entry.id} entry={entry} />
            ))}
          </LogGroup>
        ))}


        {loading && (
          <div className="flex justify-center py-6">
            <CircularProgress size={28} sx={{ color: '#786dce' }} />
          </div>
        )}


        {!loading && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#99a1af]">
            <p className="text-base">No logs found</p>
          </div>
        )}


        {hasMore && <div ref={sentinelRef} className="h-4" />}
      </div>
    </div>
  );
}
