import React, { useMemo, useState, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useDailyFeedingSummary } from "@/features/log/hooks/useDailyFeedingSummary";
import { format, subDays, parseISO, addDays } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { useTimezone } from "@/lib/contexts/timezone.context";

interface FeedingChartProps {
  babyId: string;
}

export default function FeedingChart({ babyId }: FeedingChartProps) {
  const { dailyTotals, loading } = useDailyFeedingSummary(babyId);
  const { timeZoneId } = useTimezone();

  const [offsetIndex, setOffsetIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const allData = useMemo(() => {
    if (!dailyTotals || Object.keys(dailyTotals).length === 0) {
      return [];
    }

    const dates = Object.keys(dailyTotals).sort();
    const minDateStr = dates[0];
    const todayStr = format(TZDate.tz(timeZoneId), "yyyy-MM-dd");
    let maxDateStr = todayStr;

    if (dates[dates.length - 1] > maxDateStr) {
      maxDateStr = dates[dates.length - 1];
    }

    let current = parseISO(minDateStr);
    const end = parseISO(maxDateStr);
    const data = [];

    // Ensure we have at least 15 days even if logic generates fewer
    // To do this, if end - current < 15 days, we can push minDateStr back.
    const diffTime = Math.abs(end.getTime() - current.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 14) {
      current = subDays(end, 14);
    }

    while (current <= end) {
      const dateStr = format(current, "yyyy-MM-dd");
      const info = dailyTotals[dateStr];
      const ml = info?.totalMl || 0;

      data.push({
        dateStr,
        displayDate: format(current, "MM/dd"),
        totalMl: ml,
      });
      current = addDays(current, 1);
    }

    return data;
  }, [dailyTotals, timeZoneId]);

  const DISPLAY_DAYS = 15;

  const displayData = useMemo(() => {
    if (allData.length <= DISPLAY_DAYS) return allData;
    const end = allData.length - offsetIndex;
    const start = Math.max(0, end - DISPLAY_DAYS);
    return allData.slice(start, end);
  }, [allData, offsetIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;

    if (Math.abs(deltaX) > 20) {
      // Swipe right (deltaX > 0) -> view older data -> offsetIndex increases
      const shift = deltaX > 0 ? 1 : -1;

      setOffsetIndex((prev) => {
        const next = prev + shift;
        return Math.max(0, Math.min(next, allData.length - DISPLAY_DAYS));
      });
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const handleBoxClick = (e: React.MouseEvent) => {
    if (!chartRef.current || displayData.length === 0) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const plotWidth = Math.max(1, rect.width - 30);
    let fraction = (x - 30) / plotWidth;
    fraction = Math.max(0, Math.min(1, fraction));
    const index = Math.round(fraction * (displayData.length - 1));
    setSelectedIndex(index);
  };

  const selectedData =
    selectedIndex !== null ? displayData[selectedIndex] : null;
  const selectedXPercent =
    selectedData && displayData.length > 1
      ? selectedIndex! / (displayData.length - 1)
      : 0;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#FF6B9D" }} />
      </Box>
    );
  }

  if (allData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#999" }}>
        No feeding records found.
      </Box>
    );
  }

  return (
    <Box
      ref={chartRef}
      sx={{
        position: "relative",
        width: "100%",
        height: 420,
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        outline: "none",
        "& :focus": { outline: "none" },
        "& *:focus": { outline: "none" },
        "& ::selection": { background: "transparent" },
        "& *::selection": { background: "transparent" },
        WebkitTapHighlightColor: "transparent",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleBoxClick}
    >
      {selectedData && selectedXPercent !== null && (
        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: `calc(30px + ${selectedXPercent} * (100% - 30px))`,
            transform: "translateX(-50%)",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "8px 12px",
            zIndex: 10,
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <Typography sx={{ color: "#999", fontSize: "12px", mb: 0.5 }}>
            {selectedData.displayDate}
          </Typography>
          <Typography
            sx={{ color: "#FF6B9D", fontSize: "14px", fontWeight: 600 }}
          >
            {selectedData.totalMl} ml
          </Typography>
        </Box>
      )}

      <Typography
        sx={{ fontSize: "14px", fontWeight: 600, mb: 2, color: "#333" }}
      >
        Daily Feeding Volume (Last 15 Days)
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={displayData}
          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            horizontal={true}
            stroke="#E0E0E0"
          />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: "#666" }}
            axisLine={{ stroke: "#eee" }}
            tickLine={false}
            interval={1} // Shows every other label
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#999" }}
            axisLine={{ stroke: "#eee" }}
            tickLine={false}
          />
          {/* Smooth Area + Line (Merged to avoid double Tooltip entries) */}
          <Area
            type="monotone"
            dataKey="totalMl"
            stroke="#FF6B9D"
            strokeWidth={3}
            fill="#FF6B9D"
            fillOpacity={0.1}
            dot={{ fill: "white", stroke: "#FF6B9D", strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              fill: "#FF6B9D",
              stroke: "white",
              strokeWidth: 2,
            }}
            isAnimationActive={true}
          />

          {/* Active indicator line */}
          {selectedData && (
            <ReferenceLine
              x={selectedData.displayDate}
              stroke="#FF6B9D"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
