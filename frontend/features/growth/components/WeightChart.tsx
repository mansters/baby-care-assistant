"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Box, Typography } from "@mui/material";
import type { GrowthLog } from "@/lib/types";
import { calculateAgeInMonths, formatAgeLabel } from "../utils/chart-helpers";
import { calculatePercentile } from "../utils/percentile";
import {
  WEIGHT_REFERENCE_MALE,
  WEIGHT_REFERENCE_FEMALE,
} from "../data/weight-reference-nhc-cn";
import WeightChartTooltip from "./WeightChartTooltip";

interface WeightChartProps {
  growthLogs: GrowthLog[];
  babyDateOfBirth: string;
  babyGender: "Male" | "Female";
  babyTimeZone: string;
}

const LONG_PRESS_DURATION = 300;
const HOLD_SWIPE_THRESHOLD = 30;
const DISPLAY_RECORD_COUNT = 10;

export default function WeightChart({
  growthLogs,
  babyDateOfBirth,
  babyGender,
  babyTimeZone,
}: WeightChartProps) {
  const referenceData =
    babyGender === "Male" ? WEIGHT_REFERENCE_MALE : WEIGHT_REFERENCE_FEMALE;

  // 处理所有生长记录数据（按年龄排序）
  const allProcessedData = useMemo(
    () =>
      growthLogs
        .filter((log) => log.weightKg)
        .map((log) => {
          const measureDate = log.localDate || log.eventTimeUtc;
          const ageMonths = calculateAgeInMonths(babyDateOfBirth, measureDate);
          const percentile = calculatePercentile(
            log.weightKg,
            ageMonths,
            referenceData,
          );
          const today = new Date().toISOString().split("T")[0];
          return {
            ageMonths,
            ageLabel: formatAgeLabel(ageMonths),
            weightKg: log.weightKg!,
            percentile,
            isToday: log.localDate === today,
          };
        })
        .sort((a, b) => a.ageMonths - b.ageMonths),
    [growthLogs, babyDateOfBirth, referenceData],
  );

  // 只显示最近约10条记录用于主要展示
  const displayData = useMemo(() => {
    if (allProcessedData.length <= DISPLAY_RECORD_COUNT) {
      return allProcessedData;
    }
    return allProcessedData.slice(-DISPLAY_RECORD_COUNT);
  }, [allProcessedData]);

  // X轴范围 - 根据显示数据的年龄范围设置，左右各留0.5个月边距
  const chartMinMonth = useMemo(() => {
    if (displayData.length === 0) {
      return 0;
    }
    const min = displayData[0].ageMonths;
    const max = displayData[displayData.length - 1].ageMonths;
    const padding = Math.max(0.15, (max - min) * 0.05);
    return Math.max(0, min - padding);
  }, [displayData]);

  const chartMaxMonth = useMemo(() => {
    if (displayData.length === 0) {
      return 6;
    }
    const min = displayData[0].ageMonths;
    const max = displayData[displayData.length - 1].ageMonths;
    const padding = Math.max(0.15, (max - min) * 0.05);
    return max + padding;
  }, [displayData]);

  // 是否可以向左滚动查看更多历史数据
  const canScrollLeft =
    displayData.length > 0 &&
    allProcessedData.length > displayData.length &&
    allProcessedData[0].ageMonths < chartMinMonth;

  // 生成细粒度的参考数据用于绘制平滑曲线
  const percentileCurveData = useMemo(() => {
    const data: Array<{
      ageMonths: number;
      p3: number;
      p15: number;
      p50: number;
      p85: number;
      p97: number;
      pRange: [number, number];
    }> = [];
    const range = chartMaxMonth - chartMinMonth;
    if (range <= 0) return data;
    // 生成足够的点确保曲线平滑且覆盖整个X轴
    const steps = Math.max(100, range * 20);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ageMonths = chartMinMonth + t * range;
      // 找到左右相邻的参考数据点进行线性插值
      const lowerIdx = Math.max(0, Math.floor(ageMonths));
      const upperIdx = Math.min(36, lowerIdx + 1);
      const frac = ageMonths - lowerIdx;
      const lower = referenceData[lowerIdx];
      const upper = referenceData[upperIdx];
      data.push({
        ageMonths,
        p3: lower.sd_neg2 + (upper.sd_neg2 - lower.sd_neg2) * frac,
        p15: lower.sd_neg1 + (upper.sd_neg1 - lower.sd_neg1) * frac,
        p50: lower.median + (upper.median - lower.median) * frac,
        p85: lower.sd_pos1 + (upper.sd_pos1 - lower.sd_pos1) * frac,
        p97: lower.sd_pos2 + (upper.sd_pos2 - lower.sd_pos2) * frac,
        pRange: [
          lower.sd_neg2 + (upper.sd_neg2 - lower.sd_neg2) * frac,
          lower.sd_pos2 + (upper.sd_pos2 - lower.sd_pos2) * frac,
        ],
      });
    }
    return data;
  }, [referenceData, chartMinMonth, chartMaxMonth]);

  // 交互状态
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lastSwipeTime = useRef<number>(0);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const isHolding = useRef<boolean>(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // 查找今天是否有记录
  const todayRecord = useMemo(
    () => displayData.find((d) => d.isToday),
    [displayData],
  );

  // 自定义点击处理 - 绕过Recharts自带的不可靠点选
  const handleBoxClick = useCallback(
    (e: React.MouseEvent) => {
      if (!chartRef.current || displayData.length === 0) return;
      const rect = chartRef.current.getBoundingClientRect();
      // 相对容器左侧的点击X偏移
      const x = e.clientX - rect.left;

      const W = rect.width;
      const plotWidth = Math.max(1, W - 50);
      // 左边有30px Y轴
      let fraction = (x - 30) / plotWidth;
      fraction = Math.max(0, Math.min(1, fraction));

      const targetAge =
        chartMinMonth + fraction * (chartMaxMonth - chartMinMonth);

      let closest = 0;
      let closestDist = Infinity;
      displayData.forEach((d, i) => {
        const dist = Math.abs(d.ageMonths - targetAge);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setSelectedIndex(closest);
    },
    [displayData, chartMinMonth, chartMaxMonth],
  );

  // 触摸滑动处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    touchStartX.current = e.touches[0].clientX;
    lastSwipeTime.current = Date.now();
    isHolding.current = false;

    holdTimer.current = setTimeout(() => {
      isHolding.current = true;
      setIsDragging(true);
    }, LONG_PRESS_DURATION);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (
        !isHolding.current ||
        selectedIndex === null ||
        displayData.length === 0
      )
        return;

      const now = Date.now();
      if (now - lastSwipeTime.current < 100) return;
      lastSwipeTime.current = now;

      const deltaX = e.touches[0].clientX - (touchStartX.current || 0);
      if (Math.abs(deltaX) > HOLD_SWIPE_THRESHOLD) {
        const newIndex =
          deltaX < 0
            ? Math.min(selectedIndex + 1, displayData.length - 1)
            : Math.max(selectedIndex - 1, 0);
        setSelectedIndex(newIndex);
        touchStartX.current = e.touches[0].clientX;
      }
    },
    [selectedIndex, displayData],
  );

  const handleTouchEnd = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setIsDragging(false);
    touchStartX.current = null;
    isHolding.current = false;
  }, []);

  const selectedData =
    selectedIndex !== null ? displayData[selectedIndex] : null;

  // X轴刻度
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    for (
      let m = Math.ceil(chartMinMonth);
      m <= Math.floor(chartMaxMonth);
      m++
    ) {
      ticks.push(m);
    }
    return ticks;
  }, [chartMinMonth, chartMaxMonth]);

  // 计算"今天"的X轴位置（百分比计算针对内部图表区域：左侧留出60px Y轴，右侧留出30px margin）
  const todayXPercent = useMemo(() => {
    if (!todayRecord) return null;
    const range = chartMaxMonth - chartMinMonth;
    if (range <= 0) return 0;
    return (todayRecord.ageMonths - chartMinMonth) / range;
  }, [todayRecord, chartMinMonth, chartMaxMonth]);

  // 计算选中项的X轴位置用于Tooltip
  const selectedXPercent = useMemo(() => {
    if (!selectedData) return null;
    const range = chartMaxMonth - chartMinMonth;
    if (range <= 0) return 0;
    return (selectedData.ageMonths - chartMinMonth) / range;
  }, [selectedData, chartMinMonth, chartMaxMonth]);

  const tooltipLeft =
    selectedXPercent !== null
      ? `calc(30px + ${selectedXPercent} * (100% - 50px))`
      : "50%";

  // 渲染参考线名标签 (右侧内部)
  const renderLineLabel = useCallback(
    (textStr: string) => {
      return (props: any) => {
        const { x, y, index } = props;
        if (index !== percentileCurveData.length - 1) return null;
        return (
          <text
            x={x - 4}
            y={y - 4}
            fill="#66BB6A"
            fontSize="10px"
            textAnchor="end"
            alignmentBaseline="baseline"
          >
            {textStr}
          </text>
        );
      };
    },
    [percentileCurveData.length],
  );

  // 清理 holdTimer
  useEffect(() => {
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
      }
    };
  }, []);

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
      }}
      onClick={handleBoxClick}
      onTouchStart={handleTouchStart as any}
      onTouchMove={handleTouchMove as any}
      onTouchEnd={handleTouchEnd}
    >
      {/* Tooltip */}
      <WeightChartTooltip
        ageLabel={selectedData?.ageLabel || ""}
        weightKg={selectedData?.weightKg || 0}
        percentile={selectedData?.percentile || 0}
        visible={selectedData !== null}
        leftPosition={tooltipLeft}
      />

      {/* "今天"标记 */}
      {todayRecord && todayXPercent !== null && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: `calc(30px + ${todayXPercent} * (100% - 50px))`,
            transform: "translateX(-50%)",
            zIndex: 5,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#66BB6A",
              color: "white",
              fontSize: "11px",
              fontWeight: 500,
              px: 1,
              py: 0.5,
              borderRadius: "10px",
            }}
          >
            Today
          </Box>
        </Box>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={percentileCurveData}
          margin={{ top: 60, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            horizontal={true}
            stroke="#E0E0E0"
          />
          <XAxis
            dataKey="ageMonths"
            domain={[chartMinMonth, chartMaxMonth]}
            ticks={xTicks}
            tickFormatter={(v) => (v === 0 ? "Birth" : `${v}mo`)}
            tick={{ fontSize: 10, fill: "#666" }}
            axisLine={{ stroke: "#eee" }}
            tickLine={{ stroke: "#eee" }}
            allowDataOverflow={true}
            type="number"
            scale="linear"
            interval={0}
          />
          <YAxis
            width={30}
            domain={[0, 15]}
            ticks={[3, 6, 9, 12, 15]}
            tick={{ fontSize: 10, fill: "#999" }}
            axisLine={{ stroke: "#eee" }}
            tickLine={{ stroke: "#eee" }}
          />

          {/* 百分位区间填充 */}
          <Area
            type="monotone"
            dataKey="pRange"
            stroke="none"
            fill="#66BB6A"
            fillOpacity={0.06}
            activeDot={false}
          />

          {/* 百分位曲线 */}
          <Line
            type="monotone"
            dataKey="p97"
            stroke="#66BB6A"
            strokeWidth={0.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            label={renderLineLabel("97%")}
          />
          <Line
            type="monotone"
            dataKey="p85"
            stroke="#66BB6A"
            strokeWidth={0.5}
            strokeDasharray="4 2"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            label={renderLineLabel("85%")}
          />
          <Line
            type="monotone"
            dataKey="p50"
            stroke="#66BB6A"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            label={renderLineLabel("50%")}
          />
          <Line
            type="monotone"
            dataKey="p15"
            stroke="#66BB6A"
            strokeWidth={0.5}
            strokeDasharray="4 2"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            label={renderLineLabel("15%")}
          />
          <Line
            type="monotone"
            dataKey="p3"
            stroke="#66BB6A"
            strokeWidth={0.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            label={renderLineLabel("3%")}
          />

          {/* 宝宝数据点（使用Line+dots代替Scatter） */}
          <Line
            type="monotone"
            data={displayData}
            dataKey="weightKg"
            stroke="#66BB6A"
            strokeWidth={2}
            dot={{ fill: "white", stroke: "#66BB6A", strokeWidth: 2, r: 4 }}
            activeDot={false}
            isAnimationActive={false}
          />

          {/* 选中指示器 */}
          {selectedData && (
            <ReferenceLine
              x={selectedData.ageMonths}
              stroke="#66BB6A"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <Typography
        sx={{
          fontSize: "11px",
          color: "#999",
          mt: 1,
          lineHeight: 1.4,
        }}
      >
        Reference: NHC (2025) Weight Standards for Children Under 3 Years
      </Typography>
    </Box>
  );
}
