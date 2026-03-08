"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import {
  getLocalDateKey,
  isTodayInZone,
  isYesterdayInZone,
  utcToLocalDate,
} from "@/lib/utils/datetime";
import { useTimezone } from "@/lib/contexts/timezone.context";
import { useLogList } from "@/features/log/hooks/useLogList";
import { useDailyFeedingSummary } from "@/features/log/hooks/useDailyFeedingSummary";
import { LogEntry } from "@/features/log/types";
import LogFilterBar from "./LogFilterBar";
import LogGroup from "./LogGroup";
import LogItem from "./LogItem";
import LogDetailDrawer from "./LogDetailDrawer";

interface LogListContainerProps {
  babyId: string;
}

function getDateLabel(dateStr: string, timeZoneId: string): string {
  if (isTodayInZone(dateStr, timeZoneId)) return "TODAY";
  if (isYesterdayInZone(dateStr, timeZoneId)) return "YESTERDAY";
  const date = utcToLocalDate(dateStr, timeZoneId);
  return format(date, "EEE, MMM d").toUpperCase();
}

function groupByDate(
  logs: LogEntry[],
  timeZoneId: string,
): Map<string, LogEntry[]> {
  const groups = new Map<string, LogEntry[]>();
  for (const log of logs) {
    const dateKey = getLocalDateKey(log.startTime, timeZoneId);
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
  const { timeZoneId } = useTimezone();
  const {
    logs,
    loading,
    hasMore,
    activeFilter,
    setActiveFilter,
    sentinelRef,
    setLogs,
  } = useLogList(babyId);
  const { dailyTotals } = useDailyFeedingSummary(babyId);

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const grouped = useMemo(
    () => groupByDate(logs, timeZoneId),
    [logs, timeZoneId],
  );

  const showFormulaTotals =
    activeFilter === "all" || activeFilter === "Feeding";

  const handleDrawerClose = useCallback(() => {
    setSelectedLog(null);
  }, []);

  const handleDeleted = useCallback(
    (sk: string) => {
      setLogs((prev: LogEntry[]) => prev.filter((l) => l.sk !== sk));
      setSelectedLog(null);
    },
    [setLogs],
  );

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
        <LogFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {Array.from(grouped.entries()).map(([dateKey, entries]) => (
          <LogGroup
            key={dateKey}
            dateLabel={getDateLabel(entries[0].startTime, timeZoneId)}
            feedingInfo={showFormulaTotals ? dailyTotals[dateKey] : undefined}
          >
            {entries.map((entry) => (
              <LogItem key={entry.sk} entry={entry} onSelect={setSelectedLog} />
            ))}
          </LogGroup>
        ))}

        {loading && (
          <div className="flex justify-center py-6">
            <CircularProgress size={28} sx={{ color: "#786dce" }} />
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#99a1af]">
            <p className="text-base">No logs found</p>
          </div>
        )}

        {hasMore && <div ref={sentinelRef} className="h-4" />}
      </div>

      <LogDetailDrawer
        entry={selectedLog}
        onClose={handleDrawerClose}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
