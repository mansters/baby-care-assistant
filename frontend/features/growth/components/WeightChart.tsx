'use client';

import React, { useState, useCallback, useRef } from 'react';
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

  // X轴范围
  const [minMonth, maxMonth] = getVisibleMonthRange(currentAgeMonths);

  // 处理生长记录数据
  const processedData = growthLogs
    .filter(log => log.weightKg)
    .map(log => {
      const measureDate = log.localDate || log.eventTimeUtc;
      const ageMonths = calculateAgeInMonths(babyDateOfBirth, measureDate);
      const percentile = calculatePercentile(log.weightKg, ageMonths, referenceData);
      const today = new Date().toISOString().split('T')[0];
      return {
        ageMonths,
        ageLabel: formatAgeLabel(ageMonths),
        weightKg: log.weightKg,
        percentile,
        isToday: log.localDate === today,
      };
    })
    .filter(d => d.ageMonths >= minMonth && d.ageMonths <= maxMonth)
    .sort((a, b) => a.ageMonths - b.ageMonths);

  // 交互状态
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lastSwipeTime = useRef<number>(0);

  // 查找今天是否有记录
  const todayRecord = processedData.find(d => d.isToday);

  // 点击处理 - 找到最近的数据点
  const handleClick = useCallback((e: any) => {
    if (!e || processedData.length === 0) return;

    // 如果点击在图表外或没有activeLabel，使用第一个/最后一个数据点
    const clickedAge = e.activeLabel ?? (selectedIndex !== null ? processedData[selectedIndex].ageMonths : processedData[0].ageMonths);

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
  }, [processedData, selectedIndex]);

  // 触摸滑动处理
  const handleTouchStart = useCallback((_state: any, e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    lastSwipeTime.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((_state: any, e: React.TouchEvent) => {
    if (!isDragging || selectedIndex === null || processedData.length === 0) return;

    const now = Date.now();
    if (now - lastSwipeTime.current < 100) return; // debounce
    lastSwipeTime.current = now;

    const deltaX = e.touches[0].clientX - (touchStartX.current || 0);
    if (Math.abs(deltaX) > 30) {
      const newIndex = deltaX < 0
        ? Math.min(selectedIndex + 1, processedData.length - 1)
        : Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      touchStartX.current = e.touches[0].clientX;
    }
  }, [isDragging, selectedIndex, processedData]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    touchStartX.current = null;
  }, []);

  const selectedData = selectedIndex !== null ? processedData[selectedIndex] : null;

  // X轴刻度
  const xTicks = [];
  for (let m = Math.ceil(minMonth); m <= Math.floor(maxMonth); m++) {
    xTicks.push(m);
  }

  // 计算"今天"的X轴位置（百分比）
  const todayXPercent = todayRecord
    ? ((todayRecord.ageMonths - minMonth) / (maxMonth - minMonth)) * 100
    : null;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
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
          data={processedData}
          margin={{ top: 60, right: 30, left: 0, bottom: 20 }}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 网格线 */}
          <XAxis
            dataKey="ageMonths"
            ticks={xTicks}
            tickFormatter={(v) => v === 0 ? '出生' : `${v}个月`}
            tick={{ fontSize: 10, fill: '#666' }}
            axisLine={{ stroke: '#eee' }}
            tickLine={{ stroke: '#eee' }}
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
            dataKey="weightKg"
            stroke="none"
            fill="#66BB6A"
            fillOpacity={0.08}
          />

          {/* 宝宝数据点和连接线 */}
          <Scatter
            name="体重"
            dataKey="weightKg"
            fill="white"
            stroke="#66BB6A"
            strokeWidth={2}
          />

          {/* 选中指示器 - 垂直线 */}
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

      {/* 参考来源 */}
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
