'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import type { GrowthLog } from '@/lib/types';
import { calculateAgeInMonths, formatAgeLabel, getVisibleMonthRange } from '../utils/chart-helpers';
import { calculatePercentile } from '../utils/percentile';
import { WEIGHT_REFERENCE_MALE, WEIGHT_REFERENCE_FEMALE } from '../data/weight-reference-nhc-cn';
import WeightChartTooltip from './WeightChartTooltip';

interface WeightChartProps {
  growthLogs: GrowthLog[];
  babyDateOfBirth: string;
  babyGender: 'Male' | 'Female';
  babyTimeZone: string;
}

const LONG_PRESS_DURATION = 300;
const HOLD_SWIPE_THRESHOLD = 30;

export default function WeightChart({
  growthLogs,
  babyDateOfBirth,
  babyGender,
  babyTimeZone,
}: WeightChartProps) {
  const referenceData = babyGender === 'Male' ? WEIGHT_REFERENCE_MALE : WEIGHT_REFERENCE_FEMALE;

  // 计算宝宝当前月龄
  const now = new Date().toISOString();
  const currentAgeMonths = calculateAgeInMonths(babyDateOfBirth, now);

  // X轴范围 - 使用宝宝月龄 ± 2个月
  const [minMonth, maxMonth] = getVisibleMonthRange(currentAgeMonths);

  // 生成细粒度的参考数据用于绘制平滑曲线
  const percentileCurveData = useMemo(() => {
    const data = [];
    const range = maxMonth - minMonth;
    // 生成足够的点确保曲线平滑且覆盖整个X轴
    const steps = Math.max(100, range * 20);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ageMonths = minMonth + t * range;
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
      });
    }
    return data;
  }, [referenceData, minMonth, maxMonth]);

  // 处理生长记录数据
  const processedData = useMemo(() =>
    growthLogs
      .filter(log => log.weightKg)
      .map(log => {
        const measureDate = log.localDate || log.eventTimeUtc;
        const ageMonths = calculateAgeInMonths(babyDateOfBirth, measureDate);
        const percentile = calculatePercentile(log.weightKg, ageMonths, referenceData);
        const today = new Date().toISOString().split('T')[0];
        return {
          ageMonths,
          ageLabel: formatAgeLabel(ageMonths),
          weightKg: log.weightKg!,
          percentile,
          isToday: log.localDate === today,
        };
      })
      .sort((a, b) => a.ageMonths - b.ageMonths),
    [growthLogs, babyDateOfBirth, referenceData]
  );

  // 交互状态
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lastSwipeTime = useRef<number>(0);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const isHolding = useRef<boolean>(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // 查找今天是否有记录
  const todayRecord = useMemo(() =>
    processedData.find(d => d.isToday),
    [processedData]
  );

  // 点击处理 - 找到最近的数据点
  const handleClick = useCallback((e: any) => {
    if (!e || processedData.length === 0) return;
    const clickedAge = e.activeLabel;
    if (clickedAge === undefined) return;

    let closest = 0;
    let closestDist = Infinity;
    processedData.forEach((d, i) => {
      const dist = Math.abs(d.ageMonths - clickedAge);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setSelectedIndex(closest);
  }, [processedData]);

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

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (!isHolding.current || selectedIndex === null || processedData.length === 0) return;

    const now = Date.now();
    if (now - lastSwipeTime.current < 100) return;
    lastSwipeTime.current = now;

    const deltaX = e.touches[0].clientX - (touchStartX.current || 0);
    if (Math.abs(deltaX) > HOLD_SWIPE_THRESHOLD) {
      const newIndex = deltaX < 0
        ? Math.min(selectedIndex + 1, processedData.length - 1)
        : Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      touchStartX.current = e.touches[0].clientX;
    }
  }, [selectedIndex, processedData]);

  const handleTouchEnd = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setIsDragging(false);
    touchStartX.current = null;
    isHolding.current = false;
  }, []);

  const selectedData = selectedIndex !== null ? processedData[selectedIndex] : null;

  // X轴刻度
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let m = Math.ceil(minMonth); m <= Math.floor(maxMonth); m++) {
      ticks.push(m);
    }
    return ticks;
  }, [minMonth, maxMonth]);

  // 计算"今天"的X轴位置（百分比）
  const todayXPercent = useMemo(() =>
    todayRecord
      ? ((todayRecord.ageMonths - minMonth) / (maxMonth - minMonth)) * 100
      : null,
    [todayRecord, minMonth, maxMonth]
  );

  // 清理 holdTimer
  useEffect(() => {
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
      }
    };
  }, []);

  // 处理点击事件，防止选择
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Box
      ref={chartRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: 300,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        outline: 'none',
        '& ::selection': { background: 'transparent' },
        '& *::selection': { background: 'transparent' },
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart as any}
      onTouchMove={handleTouchMove as any}
      onTouchEnd={handleTouchEnd}
    >
      {/* Tooltip */}
      <WeightChartTooltip
        ageLabel={selectedData?.ageLabel || ''}
        weightKg={selectedData?.weightKg || 0}
        percentile={selectedData?.percentile || 0}
        visible={selectedData !== null}
      />

      {/* "今天"标记 */}
      {todayRecord && todayXPercent !== null && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: `${todayXPercent}%`,
            transform: 'translateX(-50%)',
            zIndex: 5,
          }}
        >
          <Box
            sx={{
              backgroundColor: '#66BB6A',
              color: 'white',
              fontSize: '11px',
              fontWeight: 500,
              px: 1,
              py: 0.5,
              borderRadius: '10px',
            }}
          >
            今天
          </Box>
        </Box>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={percentileCurveData}
          margin={{ top: 60, right: 30, left: 0, bottom: 20 }}
          onClick={handleClick}
        >
          <XAxis
            dataKey="ageMonths"
            domain={[minMonth, maxMonth]}
            ticks={xTicks}
            tickFormatter={(v) => v === 0 ? '出生' : `${v}个月`}
            tick={{ fontSize: 10, fill: '#666' }}
            axisLine={{ stroke: '#eee' }}
            tickLine={{ stroke: '#eee' }}
            allowDataOverflow={true}
          />
          <YAxis
            domain={[0, 15]}
            ticks={[3, 6, 9, 12, 15]}
            tick={{ fontSize: 10, fill: '#999' }}
            axisLine={{ stroke: '#eee' }}
            tickLine={{ stroke: '#eee' }}
          />

          {/* 百分位区间填充 */}
          <Area
            type="monotone"
            dataKey="p97"
            stackId="ref"
            baseLine={0}
            stroke="none"
            fill="#66BB6A"
            fillOpacity={0.06}
          />

          {/* 百分位曲线 */}
          <Line type="monotone" dataKey="p97" stroke="#66BB6A" strokeWidth={0.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="p85" stroke="#66BB6A" strokeWidth={0.5} strokeDasharray="4 2" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="p50" stroke="#66BB6A" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="p15" stroke="#66BB6A" strokeWidth={0.5} strokeDasharray="4 2" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="p3" stroke="#66BB6A" strokeWidth={0.5} dot={false} isAnimationActive={false} />

          {/* 宝宝数据点 */}
          <Scatter
            name="体重"
            data={processedData}
            dataKey="weightKg"
            fill="white"
            stroke="#66BB6A"
            strokeWidth={2}
          />

          {/* 宝宝数据点连接线 */}
          <Line
            type="monotone"
            data={processedData}
            dataKey="weightKg"
            stroke="#66BB6A"
            strokeWidth={2}
            dot={false}
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
          fontSize: '11px',
          color: '#999',
          mt: 1,
          lineHeight: 1.4,
        }}
      >
        依据国家卫健委 2025 年发布的 3 岁以下婴幼儿体重标准参考区间
      </Typography>
    </Box>
  );
}
