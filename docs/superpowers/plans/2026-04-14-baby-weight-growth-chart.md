# 宝宝体重曲线图 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 实现 Insight 功能模块，包含体重曲线图（叠加 NHC 参考区间）、首页入口卡片

**架构：** 垂直线滑动交互（点击出现垂直线，hold后左右滑动切换数据点），边到边图表布局，动态 X 轴范围（宝宝实际月龄 ± 2个月）

**技术栈：** React + Next.js + Recharts + TypeScript，后端 C# .NET

---

## 文件结构

```
backend/
├── BabyCareAssistant.Domain/Entities/Baby.cs           [MODIFY]
├── BabyCareAssistant.Application/Features/Baby/Dtos/BabyDto.cs  [MODIFY]
├── BabyCareAssistant.Application/Features/Baby/Commands/CreateBaby/CreateBabyDto.cs  [MODIFY]
├── BabyCareAssistant.Application/Features/Baby/Commands/UpdateBaby/UpdateBabyDto.cs  [MODIFY]
├── BabyCareAssistant.Application/Mappings/BabyMappingExtensions.cs  [MODIFY]

frontend/
├── lib/services/user/user-context.types.ts             [MODIFY]
├── features/growth/
│   ├── data/weight-reference-nhc-cn.ts                  [NEW]
│   ├── utils/percentile.ts                              [NEW]
│   ├── utils/chart-helpers.ts                           [NEW]
│   ├── components/WeightChart.tsx                       [NEW]
│   ├── components/WeightChartTooltip.tsx                [NEW]
│   └── index.ts                                        [MODIFY]
├── app/insight/
│   ├── page.tsx                                         [NEW]
│   └── InsightPage.tsx                                  [NEW]
└── app/home/HomePage.tsx                               [MODIFY]
```

---

## Task 1: 后端 — Gender 字段 (Domain 层)

**Files:**
- Modify: `backend/BabyCareAssistant.Domain/Entities/Baby.cs`

- [ ] **Step 1: 添加 Gender 属性到 Baby 实体**

```csharp
// 在 Baby.cs 的 Baby 类中添加
public string Gender { get; set; } = string.Empty;
```

- [ ] **Step 2: 验证编译**

Run: `cd backend && dotnet build BabyCareAssistant.Domain/BabyCareAssistant.Domain.csproj`
Expected: BUILD SUCCEEDED

- [ ] **Step 3: Commit**

```bash
git add backend/BabyCareAssistant.Domain/Entities/Baby.cs
git commit -m "feat(domain): add Gender field to Baby entity"
```

---

## Task 2: 后端 — Gender 字段 (Application DTOs 层)

**Files:**
- Modify: `backend/BabyCareAssistant.Application/Features/Baby/Dtos/BabyDto.cs`
- Modify: `backend/BabyCareAssistant.Application/Features/Baby/Commands/CreateBaby/CreateBabyDto.cs`
- Modify: `backend/BabyCareAssistant.Application/Features/Baby/Commands/UpdateBaby/UpdateBabyDto.cs`
- Modify: `backend/BabyCareAssistant.Application/Mappings/BabyMappingExtensions.cs`

- [ ] **Step 1: 修改 BabyDto.cs**

```csharp
// 在 BabyDto record 中添加
public string Gender { get; init; } = string.Empty;
```

- [ ] **Step 2: 修改 CreateBabyDto.cs**

```csharp
// 在 CreateBabyDto record 中添加（可选字段，兼容旧数据）
public string? Gender { get; init; }
```

- [ ] **Step 3: 修改 UpdateBabyDto.cs**

```csharp
// 在 UpdateBabyDto record 中添加
public string? Gender { get; init; }
```

- [ ] **Step 4: 修改 BabyMappingExtensions.cs**

```csharp
// ToDto() 方法中添加
Gender = entity.Gender,

// ToEntity() 方法中修改
Gender = dto.Gender ?? string.Empty,

// UpdateEntity() 方法中添加
entity.Gender = dto.Gender ?? entity.Gender;
```

- [ ] **Step 5: 验证编译**

Run: `cd backend && dotnet build`
Expected: BUILD SUCCEEDED

- [ ] **Step 6: Commit**

```bash
git add backend/BabyCareAssistant.Application/Features/Baby/Dtos/BabyDto.cs
git add backend/BabyCareAssistant.Application/Features/Baby/Commands/CreateBaby/CreateBabyDto.cs
git add backend/BabyCareAssistant.Application/Features/Baby/Commands/UpdateBaby/UpdateBabyDto.cs
git add backend/BabyCareAssistant.Application/Mappings/BabyMappingExtensions.cs
git commit -m "feat(api): add Gender field to Baby DTOs and mappings"
```

---

## Task 3: 前端 — Gender 字段 (user-context.types.ts)

**Files:**
- Modify: `frontend/lib/services/user/user-context.types.ts`

- [ ] **Step 1: 添加 gender 到 BabyDto 接口**

```typescript
export interface BabyDto {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  timeZone: string;
  gender?: string;  // 新增
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/services/user/user-context.types.ts
git commit -m "feat(frontend): add gender field to BabyDto type"
```

---

## Task 4: 前端 — NHC 参考数据常量

**Files:**
- Create: `frontend/features/growth/data/weight-reference-nhc-cn.ts`

- [ ] **Step 1: 创建 weight-reference-nhc-cn.ts**

基于 CSV 数据创建 TypeScript 常量。数据结构：

```typescript
export interface WeightReferencePoint {
  month: number;
  sd_neg2: number;  // -2SD (3%)
  sd_neg1: number;  // -1SD (15%)
  median: number;   // Median (50%)
  sd_pos1: number;  // +1SD (85%)
  sd_pos2: number;  // +2SD (97%)
}

export const WEIGHT_REFERENCE_MALE: WeightReferencePoint[] = [
  { month: 0, sd_neg2: 2.5, sd_neg1: 2.9, median: 3.3, sd_pos1: 3.9, sd_pos2: 4.4 },
  { month: 1, sd_neg2: 3.4, sd_neg1: 3.9, median: 4.5, sd_pos1: 5.1, sd_pos2: 5.8 },
  // ... month 2-36
];

export const WEIGHT_REFERENCE_FEMALE: WeightReferencePoint[] = [
  // 从 female CSV 数据转换
];
```

数据来源：
- Male: `design/chart/weight/NHC_CN/Table_of_Standard_Deviations_for_Weight_by_Age_for_Infants_and_Toddlers_Under_3_Years_Old(male).csv`
- Female: `design/chart/weight/NHC_CN/Table_of_Standard_Deviations_for_Weight_by_Age_for_Infants_and_Toddlers_Under_3_Years_Old(female).csv`

注意：CSV 列顺序是 `month,-3SD,-2SD,-1SD,Median,1SD,2SD,3SD`，但我们需要的是 `-2SD,-1SD,Median,1SD,2SD`（对应 3%,15%,50%,85%,97%）

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/features/growth/data/weight-reference-nhc-cn.ts
git commit -m "feat(growth): add NHC weight reference data constants"
```

---

## Task 5: 前端 — 百分位计算工具

**Files:**
- Create: `frontend/features/growth/utils/percentile.ts`

- [ ] **Step 1: 创建 percentile.ts**

```typescript
import type { WeightReferencePoint } from '../data/weight-reference-nhc-cn';

/**
 * 线性插值计算指定月龄的参考数据点
 */
export function interpolateReferenceAtAge(
  ageMonths: number,
  data: WeightReferencePoint[]
): WeightReferencePoint {
  const floorMonth = Math.floor(ageMonths);
  const ceilMonth = Math.ceil(ageMonths);

  if (floorMonth === ceilMonth) {
    return data[floorMonth];
  }

  const t = ageMonths - floorMonth;
  const lower = data[floorMonth];
  const upper = data[ceilMonth];

  return {
    month: ageMonths,
    sd_neg2: lower.sd_neg2 + (upper.sd_neg2 - lower.sd_neg2) * t,
    sd_neg1: lower.sd_neg1 + (upper.sd_neg1 - lower.sd_neg1) * t,
    median: lower.median + (upper.median - lower.median) * t,
    sd_pos1: lower.sd_pos1 + (upper.sd_pos1 - lower.sd_pos1) * t,
    sd_pos2: lower.sd_pos2 + (upper.sd_pos2 - lower.sd_pos2) * t,
  };
}

/**
 * 标准正态分布 CDF 近似（Abramowitz and Stegun）
 */
export function zScoreToPercentile(z: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);
  const t = 1.0 / (1.0 + p * absZ);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ / 2);

  return (0.5 + sign * (0.5 - y)) * 100;
}

/**
 * 计算体重在参考数据中的百分位
 */
export function calculatePercentile(
  weightKg: number,
  ageMonths: number,
  referenceData: WeightReferencePoint[]
): number {
  const ref = interpolateReferenceAtAge(ageMonths, referenceData);

  // 计算 Z-score（在 -2SD 到 +2SD 范围内）
  let z: number;
  if (weightKg <= ref.sd_neg2) {
    z = -2 + (weightKg - ref.sd_neg2) / (ref.sd_neg2 - ref.sd_neg1) * 0.5;
  } else if (weightKg <= ref.sd_neg1) {
    z = -1 + (weightKg - ref.sd_neg1) / (ref.sd_neg1 - ref.median) * 1;
  } else if (weightKg <= ref.median) {
    z = (weightKg - ref.median) / (ref.sd_neg1 - ref.median);
  } else if (weightKg <= ref.sd_pos1) {
    z = (weightKg - ref.median) / (ref.sd_pos1 - ref.median);
  } else if (weightKg <= ref.sd_pos2) {
    z = 1 + (weightKg - ref.sd_pos1) / (ref.sd_pos2 - ref.sd_pos1);
  } else {
    z = 2 + (weightKg - ref.sd_pos2) / (ref.sd_pos2 - ref.sd_pos1) * 0.5;
  }

  return zScoreToPercentile(z);
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/features/growth/utils/percentile.ts
git commit -m "feat(growth): add percentile calculation utilities"
```

---

## Task 6: 前端 — 月龄计算工具

**Files:**
- Create: `frontend/features/growth/utils/chart-helpers.ts`

- [ ] **Step 1: 创建 chart-helpers.ts**

```typescript
/**
 * 计算两个日期之间的精确月龄
 * @param dob - 出生日期 (ISO string)
 * @param measureDate - 测量日期 (ISO string)
 * @returns 月龄（小数）
 */
export function calculateAgeInMonths(dob: string, measureDate: string): number {
  const birth = new Date(dob);
  const measured = new Date(measureDate);

  const months = (measured.getFullYear() - birth.getFullYear()) * 12 +
                 (measured.getMonth() - birth.getMonth());

  const daysInMonth = new Date(measured.getFullYear(), measured.getMonth() + 1, 0).getDate();
  const days = (measured.getDate() - birth.getDate()) / daysInMonth;

  return months + days;
}

/**
 * 格式化月龄为中文标签
 * @param months - 月龄（小数）
 * @returns 格式 "X个月Y天"
 */
export function formatAgeLabel(months: number): string {
  const wholeMonths = Math.floor(months);
  const days = Math.round((months - wholeMonths) * 30);
  return `${wholeMonths}个月${days}天`;
}

/**
 * 计算 X 轴可见范围
 * @param babyAgeMonths - 宝宝当前月龄
 * @returns [minMonth, maxMonth]
 */
export function getVisibleMonthRange(babyAgeMonths: number): [number, number] {
  const minMonth = Math.max(0, Math.floor(babyAgeMonths) - 2);
  const maxMonth = Math.min(36, Math.ceil(babyAgeMonths) + 2);
  return [minMonth, maxMonth];
}

/**
 * 将月龄转换为 X 轴位置
 */
export function monthToXPosition(
  month: number,
  minMonth: number,
  maxMonth: number,
  chartWidth: number,
  padding: number = 40
): number {
  const range = maxMonth - minMonth;
  const usableWidth = chartWidth - padding * 2;
  return padding + ((month - minMonth) / range) * usableWidth;
}

/**
 * 将 X 位置转换为月龄
 */
export function xPositionToMonth(
  x: number,
  minMonth: number,
  maxMonth: number,
  chartWidth: number,
  padding: number = 40
): number {
  const range = maxMonth - minMonth;
  const usableWidth = chartWidth - padding * 2;
  return minMonth + ((x - padding) / usableWidth) * range;
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/features/growth/utils/chart-helpers.ts
git commit -m "feat(growth): add chart helper utilities"
```

---

## Task 7: 前端 — 安装 Recharts

- [ ] **Step 1: 安装 recharts**

Run: `cd frontend && npm install recharts`
Expected: 包安装成功，package.json 更新

- [ ] **Step 2: 验证编译**

Run: `cd frontend && npm run build`
Expected: 构建成功

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "deps: install recharts for growth chart visualization"
```

---

## Task 8: 前端 — WeightChartTooltip 组件

**Files:**
- Create: `frontend/features/growth/components/WeightChartTooltip.tsx`

- [ ] **Step 1: 创建 WeightChartTooltip.tsx**

```typescript
'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface WeightChartTooltipProps {
  ageLabel: string;      // "3个月15天"
  weightKg: number;      // 6.5
  percentile: number;     // 65.5
  visible: boolean;
}

export default function WeightChartTooltip({
  ageLabel,
  weightKg,
  percentile,
  visible,
}: WeightChartTooltipProps) {
  if (!visible) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 35,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: 120,
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <Typography
        sx={{ fontSize: '12px', color: '#666666' }}
      >
        {ageLabel}
      </Typography>
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#333333',
          my: 0.5,
        }}
      >
        {weightKg.toFixed(1)}kg
      </Typography>
      <Typography
        sx={{ fontSize: '12px', color: '#66BB6A', fontWeight: 500 }}
      >
        百分位 {percentile.toFixed(1)}%
      </Typography>
    </Paper>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/features/growth/components/WeightChartTooltip.tsx
git commit -m "feat(growth): add WeightChartTooltip component"
```

---

## Task 9: 前端 — WeightChart 主组件

**Files:**
- Create: `frontend/features/growth/components/WeightChart.tsx`

这是最核心的组件，包含：
- Recharts 图表（边到边布局、虚线网格）
- 垂直线滑动交互（点击 + hold & slide）
- "今天"标记（仅当今天有记录时显示在顶部）
- 百分位区间填充
- 数据点和连接线

- [ ] **Step 1: 创建 WeightChart.tsx**

完整实现（关键部分）：

```typescript
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
  Tooltip as RechartsTooltip,
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
      const ageMonths = calculateAgeInMonths(babyDateOfBirth, log.localDate || log.eventTimeUtc);
      const percentile = calculatePercentile(log.weightKg, ageMonths, referenceData);
      return {
        ageMonths,
        ageLabel: formatAgeLabel(ageMonths),
        weightKg: log.weightKg,
        percentile,
        isToday: log.localDate === new Date().toISOString().split('T')[0],
      };
    })
    .filter(d => d.ageMonths >= minMonth && d.ageMonths <= maxMonth)
    .sort((a, b) => a.ageMonths - b.ageMonths);

  // 交互状态
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // 查找今天是否有记录
  const todayRecord = processedData.find(d => d.isToday);

  // 点击处理
  const handleClick = useCallback((e: any) => {
    if (!e || !e.activeLabel) return;
    const clickedAge = e.activeLabel;
    // 找到最近的数据点
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
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || selectedIndex === null || processedData.length === 0) return;

    const deltaX = e.touches[0].clientX - (touchStartX.current || 0);
    if (Math.abs(deltaX) > 30) {
      // 切换到相邻数据点
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
      {todayRecord && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: `${((todayRecord.ageMonths - minMonth) / (maxMonth - minMonth)) * 100}%`,
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

          {/* 百分位曲线 */}
          {/* 使用 ReferenceLine 或自定义曲线绘制 */}

          {/* 宝宝数据点 */}
          <Scatter
            name="体重"
            dataKey="weightKg"
            fill="white"
            stroke="#66BB6A"
            strokeWidth={2}
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
```

注意：这是简化版本，实际需要根据 Recharts API 调整。关键交互：
1. 点击出现垂直线
2. hold后左右滑动切换数据点
3. "今天"标记在顶部（仅当今天有记录）
4. 悬浮窗在顶部居中

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/features/growth/components/WeightChart.tsx
git commit -m "feat(growth): add WeightChart component with vertical line interaction"
```

---

## Task 10: 前端 — 更新 growth feature 导出

**Files:**
- Modify: `frontend/features/growth/index.ts`

- [ ] **Step 1: 更新 index.ts**

```typescript
export { default as GrowthForm } from './components/GrowthForm';
export { default as WeightChart } from './components/WeightChart';
export { default as WeightChartTooltip } from './components/WeightChartTooltip';
```

- [ ] **Step 2: 验证编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/features/growth/index.ts
git commit -m "feat(growth): export WeightChart and WeightChartTooltip"
```

---

## Task 11: 前端 — Insight 页面

**Files:**
- Create: `frontend/app/insight/page.tsx`
- Create: `frontend/app/insight/InsightPage.tsx`

- [ ] **Step 1: 创建 page.tsx (Server Component)**

```typescript
import { cookies } from 'next/headers';
import { getUserContext } from '@/lib/services/user/user.service';
import { getGrowthLogs } from '@/lib/services/growth/growth.service';
import InsightPage from './InsightPage';

export default async function InsightPageRoute() {
  const cookieStore = await cookies();
  const userContext = await getUserContext(cookieStore);

  if (!userContext?.families?.[0]?.babies?.[0]) {
    return <div>No baby found</div>;
  }

  const baby = userContext.families[0].babies[0];
  const growthLogs = await getGrowthLogs(baby.id, 500);

  return (
    <InsightPage
      baby={baby}
      growthLogs={growthLogs}
    />
  );
}
```

- [ ] **Step 2: 创建 InsightPage.tsx (Client Component)**

```typescript
'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { WeightChart } from '@/features/growth';
import type { BabyDto } from '@/lib/services/user';
import type { GrowthLog } from '@/lib/types';

interface InsightPageProps {
  baby: BabyDto;
  growthLogs: GrowthLog[];
}

export default function InsightPage({ baby, growthLogs }: InsightPageProps) {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <IconButton onClick={() => router.back()} sx={{ color: 'white' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Insight
        </Typography>
      </Box>

      {/* Tab */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee' }}>
        <Box
          sx={{
            backgroundColor: '#66BB6A',
            color: 'white',
            px: 2,
            py: 0.75,
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Growth
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <WeightChart
          growthLogs={growthLogs}
          babyDateOfBirth={baby.dateOfBirth}
          babyGender={baby.gender as 'Male' | 'Female'}
          babyTimeZone={baby.timeZone}
        />
      </Box>
    </Box>
  );
}
```

- [ ] **Step 3: 验证编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add frontend/app/insight/page.tsx frontend/app/insight/InsightPage.tsx
git commit -m "feat(insight): add Insight page with Growth tab"
```

---

## Task 12: 前端 — 首页 Insight 入口卡片

**Files:**
- Modify: `frontend/app/home/HomePage.tsx`

- [ ] **Step 1: 修改 HomePage.tsx**

在 `features` 数组中添加 Insight 卡片（条件：仅当 baby.gender 有值）：

```typescript
const features = [
  // ... existing features ...
];

// 添加 Insight 卡片条件判断
const showInsightCard = !!baby.gender;

const allFeatures = showInsightCard
  ? [
      ...features,
      {
        icon: <FiTrendingUp />,  // 或使用其他适合的图标
        title: 'Insight',
        subtitle: '体重曲线分析',
        backgroundColor: '#E8F5E9',
        iconColor: '#66BB6A',
        href: '/insight',
      },
    ]
  : features;
```

然后将 `{features.map(...)` 改为 `{allFeatures.map(...)}`

- [ ] **Step 2: 验证编译**

Run: `cd frontend && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add frontend/app/home/HomePage.tsx
git commit -m "feat(home): add conditional Insight card when baby.gender is set"
```

---

## 验证计划

### 自动化测试
- Backend: `cd backend && dotnet build`
- Frontend: `cd frontend && npm run build`

### 手动验证
1. 首页 Insight 卡片仅在 baby.gender 有值时显示
2. Insight 页面加载正常，Growth Tab 显示体重曲线
3. 男女宝宝分别显示正确的参考曲线
4. 宝宝数据点正确显示在图表上
5. 点击图表出现垂直线指向最近数据点
6. hold后左右滑动切换数据点
7. 悬浮窗显示月龄、体重、百分位
8. "今天"标记在顶部（仅今天有记录时）
9. X轴范围正确（宝宝月龄 ± 2个月）
10. 图表在移动端（375px）显示正常

---

## 依赖关系

```
Task 1 (Backend Gender)
    ↓
Task 2 (Backend DTOs)
    ↓
Task 3 (Frontend Gender)
    ↓
Task 4 (NHC Reference Data)
    ↓
Task 5 (Percentile Utils) ← Task 4
    ↓
Task 6 (Chart Helpers)
    ↓
Task 7 (Install Recharts)
    ↓
Task 8 (Tooltip) ← Task 7
    ↓
Task 9 (WeightChart) ← Task 5, 6, 7, 8
    ↓
Task 10 (Export Updates) ← Task 8, 9
    ↓
Task 11 (Insight Page) ← Task 10
    ↓
Task 12 (Home Insight Card) ← Task 3, 11
```
