/**
 * 计算两个日期之间的精确月龄
 * @param dob - 出生日期 (ISO string)
 * @param measureDate - 测量日期 (ISO string)
 * @returns 月龄（小数）
 */
export function calculateAgeInMonths(dob: string, measureDate: string): number {
  const birth = new Date(dob);
  const measured = new Date(measureDate);

  // Validate dates
  if (isNaN(birth.getTime()) || isNaN(measured.getTime())) {
    throw new Error('Invalid date provided');
  }

  // Handle negative age
  if (measured < birth) {
    return 0;
  }

  const yearDiff = measured.getFullYear() - birth.getFullYear();
  const monthDiff = measured.getMonth() - birth.getMonth();
  const birthDay = birth.getDate();
  const measuredDay = measured.getDate();

  // Calculate full months
  let months: number;
  let fractional: number;

  if (measuredDay >= birthDay) {
    // Measured day is on or after birth day - use simple calculation
    months = yearDiff * 12 + monthDiff;
    fractional = (measuredDay - birthDay) / 30;
  } else {
    // Measured day is before birth day - borrow from previous month
    // e.g., Born Jan 31, measured Feb 28 = 0 full months + 28/30 of month
    months = yearDiff * 12 + monthDiff - 1;
    const daysInBirthMonth = new Date(birth.getFullYear(), birth.getMonth() + 1, 0).getDate();
    fractional = (daysInBirthMonth - birthDay + measuredDay) / 30;
  }

  return months + fractional;
}

/**
 * 格式化月龄为中文标签
 * @param months - 月龄（小数）
 * @returns 格式 "X个月Y天"
 */
export function formatAgeLabel(months: number): string {
  const wholeMonths = Math.floor(months);
  const days = Math.round((months - wholeMonths) * 30);
  const adjustedMonths = days >= 30 ? wholeMonths + 1 : wholeMonths;
  const adjustedDays = days >= 30 ? days - 30 : days;
  return `${adjustedMonths}mo ${adjustedDays}d`;
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

  // Division by zero protection
  if (range === 0 || usableWidth === 0) {
    return padding;
  }

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

  // Division by zero protection
  if (range === 0 || usableWidth === 0) {
    return minMonth;
  }

  return minMonth + ((x - padding) / usableWidth) * range;
}
