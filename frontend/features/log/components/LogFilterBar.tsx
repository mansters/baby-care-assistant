"use client";

import { LogType } from "@/features/log/types";
import type { LogFilter } from "@/features/log/hooks/useLogList";

interface LogFilterBarProps {
  activeFilter: LogFilter;
  onFilterChange: (filter: LogFilter) => void;
  activeBgColor?: string;
  activeTextColor?: string;
  showAll?: boolean;
}

const FILTERS: { label: string; value: LogFilter }[] = [
  { label: "All", value: "all" },
  { label: "Feeding", value: LogType.Feeding },
  { label: "Growth", value: LogType.Growth },
  // { label: 'Diaper', value: LogType.Diaper },
  // { label: 'Sleep', value: LogType.Sleep },
];

export default function LogFilterBar({
  activeFilter,
  onFilterChange,
  activeBgColor = "#786dce",
  activeTextColor = "white",
  showAll = true,
}: LogFilterBarProps) {
  const displayedFilters = showAll
    ? FILTERS
    : FILTERS.filter((f) => f.value !== "all");

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
      {displayedFilters.map((f) => {
        const isActive = activeFilter === f.value;
        return (
          <button
            key={String(f.value)}
            onClick={() => onFilterChange(f.value)}
            style={
              isActive
                ? { backgroundColor: activeBgColor, color: activeTextColor }
                : undefined
            }
            className={`
              flex-shrink-0 h-9 px-4 rounded-full text-sm font-medium
              transition-colors duration-150
              ${!isActive && "bg-[#f3f4f6] text-[#364153] hover:bg-[#e5e7eb]"}
            `}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
