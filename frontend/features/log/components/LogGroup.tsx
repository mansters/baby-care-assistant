"use client";

import { ReactNode } from "react";
import type { DailyFeedingInfo } from "@/lib/services/feeding/feeding.service";

interface LogGroupProps {
  dateLabel: string;
  feedingInfo?: DailyFeedingInfo;
  children: ReactNode;
}

export default function LogGroup({
  dateLabel,
  feedingInfo,
  children,
}: LogGroupProps) {
  return (
    <div className="mb-2">
      <div className="sticky top-0 z-10 bg-[#f9fafb] py-2 px-4 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-[#99a1af] uppercase">
          {dateLabel}
        </span>
        {feedingInfo && feedingInfo.totalMl > 0 && (
          <span className="text-xs font-semibold text-[#FF6B9D]">
            {feedingInfo.totalMl}ml · {feedingInfo.feedCount}{" "}
            {feedingInfo.feedCount === 1 ? "feed" : "feeds"}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 px-4">{children}</div>
    </div>
  );
}
