"use client";

import { LogEntry } from "@/features/log/types";
import { getRenderer } from "@/features/log/strategies/registry";
import { FeatureTheme } from "@/lib/theme/feature-theme";
import { formatLocalDate } from "@/lib/utils/datetime";
import { useTimezone } from "@/lib/contexts/timezone.context";

interface LogItemProps {
  entry: LogEntry;
  pending?: "deleting";
  onSelect: (entry: LogEntry) => void;
}

export default function LogItem({ entry, pending, onSelect }: LogItemProps) {
  const { timeZoneId } = useTimezone();
  const renderer = getRenderer(entry.type, entry.details);
  const featureKey = renderer.getFeatureKey();
  const theme = FeatureTheme[featureKey as keyof typeof FeatureTheme];
  const content = renderer.renderContent(entry.details);
  const icon = renderer.getIcon(entry.details);
  const time = formatLocalDate(entry.startTime, "HH:mm", timeZoneId);

  const isDeleting = pending === "deleting";

  return (
    <div
      className={`flex items-start gap-3 py-1 ${isDeleting ? "pointer-events-none" : "cursor-pointer"}`}
      onClick={isDeleting ? undefined : () => onSelect(entry)}
      role="button"
      tabIndex={isDeleting ? -1 : 0}
      onKeyDown={(e) => {
        if (!isDeleting && (e.key === "Enter" || e.key === " "))
          onSelect(entry);
      }}
      style={{
        opacity: isDeleting ? 0.5 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <div className="w-14 flex-shrink-0 pt-2">
        <span className="text-base font-bold text-[#364153]">{time}</span>
      </div>

      <div
        className={`flex-1 rounded-[14px] p-3 transition-all ${isDeleting ? "animate-pulse" : "hover:brightness-95 active:brightness-90"} overflow-hidden`}
        style={{
          backgroundColor: isDeleting
            ? "#fef2f2"
            : theme?.surfaceLight || "#f3f4f6",
          border: isDeleting
            ? "1.5px dashed #f87171"
            : "1.5px solid transparent",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: isDeleting
                ? "#f87171"
                : theme?.primary || "#6b7280",
              color: "#ffffff",
            }}
          >
            {icon}
          </div>

          <span className="text-base font-bold text-[#364153] flex-1">
            {content}
          </span>

          {isDeleting && (
            <span className="text-xs font-medium text-[#f87171] whitespace-nowrap">
              Deleting...
            </span>
          )}
        </div>

        {entry.note && !isDeleting && (
          <p className="text-sm text-[#6a7282] mt-1 ml-12 truncate">
            {entry.note}
          </p>
        )}
      </div>
    </div>
  );
}
