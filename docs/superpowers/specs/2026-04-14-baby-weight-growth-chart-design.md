# 宝宝体重曲线图 — 设计文档

> **状态**: 已确认
> **日期**: 2026-04-14

## 1. 概述

### 1.1 功能目标

新增 **Insight（数据洞察）** 功能模块：

- 首页增加 Insight 入口卡片（仅当 baby.gender 有值时显示）
- Insight 页面顶部 Tab 导航（当前仅 Growth）
- Growth Tab 下展示**体重曲线图**，叠加**国家卫健委 (NHC) 标准参考区间**

### 1.2 核心交互决策

| 决策点     | 结论                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| X轴范围    | 自动裁剪至宝宝实际月龄 ± 2个月                                                     |
| "今天"标记 | 仅当今天有体重记录时显示，显示在图表顶部区域                                       |
| 交互方式   | **垂直线滑动**：点击图表任意位置出现垂直线指向最近数据点，hold后左右滑动切换数据点 |

---

## 2. 视觉规格

### 2.1 图表布局

- **边到边布局**：图表撑满容器，坐标轴在图表内侧
- **Y轴标签**：内侧显示，3/6/9/12/15kg
- **X轴标签**：底部显示月龄（出生、1个月、2个月...）
- **虚线网格**：横向+纵向虚线，便于读数

### 2.2 百分位曲线

| 百分位 | 线型 | 宽度  |
| ------ | ---- | ----- |
| 97%    | 实线 | 0.5px |
| 85%    | 虚线 | 0.5px |
| 50%    | 实线 | 1.5px |
| 15%    | 虚线 | 0.5px |
| 3%     | 实线 | 0.5px |

**区间填充**：

- 85%-97%：最外层，`#66BB6A` opacity 8%
- 50%-85%：中间层，`#66BB6A` opacity 15%
- 15%-50%：中间层，`#66BB6A` opacity 15%
- 3%-15%：最外层，`#66BB6A` opacity 8%

### 2.3 宝宝数据点

- **默认状态**：空心圆，白底 + `#66BB6A` 边框 2px，直径 8px
- **选中状态**：实心圆，`#66BB6A` 填充，直径 12px
- **连接线**：`#66BB6A`，2px 实线

### 2.4 "今天"标记

- 位置：图表顶部区域（避免与X轴标签冲突）
- 样式：垂直虚线 + 圆角徽章背景
- 颜色：`#66BB6A`

### 2.5 悬浮窗（Tooltip）

- 位置：图表顶部居中
- 样式：白色背景、圆角12px、阴影
- 内容：
  - 月龄：X个月Y天
  - 体重：X.Xkg
  - 百分位：XX.X%

### 2.6 颜色主题

| 元素     | 颜色      |
| -------- | --------- |
| 主色     | `#66BB6A` |
| 文字     | `#333333` |
| 次要文字 | `#666666` |
| 辅助文字 | `#999999` |
| 网格线   | `#EEEEEE` |
| 背景     | `#FFFFFF` |

---

## 3. 交互规格

### 3.1 垂直线滑动交互

**流程**：

1. **点击** - 用户在图表区域内点击任意位置
2. **选中** - 出现垂直线，自动指向最近的**数据点**
3. **悬浮窗** - 显示该数据点的详情
4. **Hold & Slide** - 用户按住图表并左右滑动，垂直线在数据点之间切换
5. **松开** - 停留在最后指向的数据点

**规则**：

- 触摸区域覆盖整个图表
- 滑动只在有数据的月龄范围内有效
- 相邻数据点之间线性过渡

### 3.2 "今天"标记行为

- **仅当今天有体重记录时显示**
- 若今天有记录，标记在今天位置，悬浮窗显示今天数据
- 若今天无记录，标记不显示

### 3.3 X轴动态范围

- 初始显示：宝宝实际月龄 ± 2个月
- 最小范围：0个月 ~ 最大月龄
- 最大范围：不超过 0-36个月

---

## 4. 数据层

### 4.1 NHC 参考数据

**文件**：`design/chart/weight/NHC_CN/*.csv`

**映射**：

- -2SD → 3%
- -1SD → 15%
- Median → 50%
- +1SD → 85%
- +2SD → 97%

**存储**：Hardcode 为 TypeScript 常量，不存入数据库

### 4.2 宝宝体重数据

**API**：`GET /api/GrowthLog?babyId={babyId}&limit=500`

---

## 5. 前端架构

### 5.1 文件结构

```
frontend/
├── app/
│   └── insight/                           # [NEW]
│       ├── page.tsx                        #   Server Component
│       └── InsightPage.tsx                 #   Client Component
├── features/
│   └── growth/
│       ├── components/
│       │   ├── WeightChart.tsx             # [NEW] 主图表组件
│       │   └── WeightChartTooltip.tsx     # [NEW] 悬浮窗
│       ├── data/
│       │   └── weight-reference-nhc-cn.ts  # [NEW] NHC 参考数据
│       ├── utils/
│       │   ├── percentile.ts               # [NEW] 百分位计算
│       │   └── chart-helpers.ts            # [NEW] 月龄计算
│       └── index.ts                        # [MODIFY] 导出新组件
```

### 5.2 组件接口

```typescript
interface WeightChartProps {
  growthLogs: GrowthLog[];
  babyDateOfBirth: string;
  babyGender: "Male" | "Female";
  babyTimeZone: string;
}
```

---

## 6. 后端 Gender 字段

### 6.1 改动范围

| 层级        | 文件                       | 改动               |
| ----------- | -------------------------- | ------------------ |
| Domain      | `Baby.cs`                  | 增加 `Gender` 属性 |
| Application | `BabyDto.cs`               | 增加 `Gender`      |
| Application | `CreateBabyDto.cs`         | 增加 `Gender?`     |
| Application | `UpdateBabyDto.cs`         | 增加 `Gender?`     |
| Application | `BabyMappingExtensions.cs` | 映射逻辑           |

### 6.2 条件显示逻辑

首页 Insight 卡片：**仅当 `baby.gender` 有值时显示**

---

## 7. 开发阶段

| 阶段    | 内容                                     |
| ------- | ---------------------------------------- |
| Phase 0 | Gender 字段（后端+前端）                 |
| Phase 1 | 数据层（参考数据、百分位计算、月龄计算） |
| Phase 2 | 图表组件（Recharts、垂直线滑动交互）     |
| Phase 3 | 页面集成（/insight 路由、首页卡片）      |
| Phase 4 | 打磨（网格、"今天"标记、悬浮窗定位）     |

---

## 8. 参考

- 设计稿：见 `/design/growthLog/spec.md`
- 实现计划：见 `/design/growthLog/implementation_plan.md`
- 参考效果图：`/design/growthLog/image.png`
