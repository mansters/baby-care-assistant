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

  // X轴范围
  const [minMonth, maxMonth] = getVisibleMonthRange(currentAgeMonths);

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
          weightKg: log.weightKg,
          percentile,
          isToday: log.localDate === today,
        };
      })
      .filter(d => d.ageMonths >= minMonth && d.ageMonths <= maxMonth)
      .sort((a, b) => a.ageMonths - b.ageMonths),
    [growthLogs, babyDateOfBirth, minMonth, maxMonth]
  );

  // 处理参考百分位区间数据 - 计算band高度用于堆叠填充
  const percentileBandData = useMemo(() =>
    referenceData
      .filter(r => r.month >= minMonth && r.month <= maxMonth)
      .map(r => ({
        ageMonths: r.month,
        // 使用差值计算band高度，这样堆叠时能正确填充区间
        band3to15: r.sd_neg1 - r.sd_neg2,   // P3-P15区间
        band15to50: r.median - r.sd_neg1,    // P15-P50区间
        band50to85: r.sd_pos1 - r.median,    // P50-P85区间
        band85to97: r.sd_pos2 - r.sd_pos1,   // P85-P97区间
        // 保留原值用于绘制曲线
        p3: r.sd_neg2,
        p15: r.sd_neg1,
        p50: r.median,
        p85: r.sd_pos1,
        p97: r.sd_pos2,
      })),
    [referenceData, minMonth, maxMonth]
  );

  // 交互状态
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lastSwipeTime = useRef<number>(0);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const isHolding = useRef<boolean>(false);

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

  // 触摸滑动处理 - 带长按检测，防止默认选择行为
  const handleTouchStart = useCallback((_state: any, e: React.TouchEvent) => {
    e.preventDefault(); // 阻止默认行为，防止蓝色选择框
    touchStartX.current = e.touches[0].clientX;
    lastSwipeTime.current = Date.now();
    isHolding.current = false;

    holdTimer.current = setTimeout(() => {
      isHolding.current = true;
      setIsDragging(true);
    }, LONG_PRESS_DURATION);
  }, []);

  const handleTouchMove = useCallback((_state: any, e: React.TouchEvent) => {
    e.preventDefault(); // 阻止默认行为
    if (!isHolding.current || selectedIndex === null || processedData.length === 0) return;

    const now = Date.now();
    if (now - lastSwipeTime.current < 100) return; // debounce
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
    const ticks = [];
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

  // 清理 holdTimer 防止组件卸载时 timer 未清除
  useEffect(() => {
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
      }
    };
  }, []);

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

          {/* 百分位区间填充 - 用Area填充整个参考范围作为背景 */}
          <Area
            type="monotone"
            data={percentileBandData}
            dataKey="p97"
            stackId="ref"
            baseLine={0}
            stroke="none"
            fill="#66BB6A"
            fillOpacity={0.06}
          />

          {/* 百分位曲线 - 用Line绘制各百分位曲线 */}
          {/* 97%曲线 */}
          <Line
            type="monotone"
            data={percentileBandData}
            dataKey="p97"
            stroke="#66BB6A"
            strokeWidth={0.5}
            dot={false}
            isAnimationActive={false}
          />
          {/* 85%曲线 */}
          <Line
            type="monotone"
            data={percentileBandData}
            dataKey="p85"
            stroke="#66BB6A"
            strokeWidth={0.5}
            strokeDasharray="4 2"
            dot={false}
            isAnimationActive={false}
          />
          {/* 50%曲线 */}
          <Line
            type="monotone"
            data={percentileBandData}
            dataKey="p50"
            stroke="#66BB6A"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          {/* 15%曲线 */}
          <Line
            type="monotone"
            data={percentileBandData}
            dataKey="p15"
            stroke="#66BB6A"
            strokeWidth={0.5}
            strokeDasharray="4 2"
            dot={false}
            isAnimationActive={false}
          />
          {/* 3%曲线 */}
          <Line
            type="monotone"
            data={percentileBandData}
            dataKey="p3"
            stroke="#66BB6A"
            strokeWidth={0.5}
            dot={false}
            isAnimationActive={false}
          />

          {/* 宝宝数据点 */}
          <Scatter
            name="体重"
            dataKey="weightKg"
            fill="white"
            stroke="#66BB6A"
            strokeWidth={2}
          />

          {/* 宝宝数据点连接线 */}
          <Line
            type="monotone"
            dataKey="weightKg"
            stroke="#66BB6A"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
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
