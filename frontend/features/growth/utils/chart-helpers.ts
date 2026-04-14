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
