import type { WeightReferencePoint } from '../data/weight-reference-nhc-cn';

const MIN_AGE_MONTHS = 0;
const MAX_AGE_MONTHS = 36;
const EPSILON = 1e-10;

/**
 * 线性插值计算指定月龄的参考数据点
 *
 * @param ageMonths - 月龄（0-36个月）
 * @param data - 参考数据数组（长度为37，对应0-36个月）
 * @returns 指定月龄的体重参考点数据
 */
export function interpolateReferenceAtAge(
  ageMonths: number,
  data: WeightReferencePoint[]
): WeightReferencePoint {
  // Input validation: check for empty data array
  if (!data || data.length === 0) {
    throw new Error('referenceData cannot be empty');
  }

  // Bounds checking: clamp ageMonths to valid range [0, 36]
  // If ageMonths < 0, return data[0] (youngest available)
  // If ageMonths >= 36, return data[36] (oldest available)
  const clampedAge = Math.max(MIN_AGE_MONTHS, Math.min(ageMonths, MAX_AGE_MONTHS));

  const floorMonth = Math.floor(clampedAge);
  const ceilMonth = Math.ceil(clampedAge);

  // Clamp to valid indices within data array
  const safeFloor = Math.max(0, Math.min(floorMonth, data.length - 1));
  const safeCeil = Math.max(0, Math.min(ceilMonth, data.length - 1));

  if (safeFloor === safeCeil) {
    return data[safeFloor];
  }

  const t = clampedAge - safeFloor;
  const lower = data[safeFloor];
  const upper = data[safeCeil];

  return {
    month: clampedAge,
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
 *
 * Z-score分段计算说明：
 * - 使用线性插值将体重映射到Z-score（标准差分数）
 * - 在每个SD区间内，Z-score的变化范围是1.0（例如从-2到-1，或从0到1）
 * - 在边界区间（<-2SD 或 >+2SD），Z-score变化范围是0.5，因为这些区间只覆盖半个标准差
 *
 * @param weightKg - 体重（公斤）
 * @param ageMonths - 月龄
 * @param referenceData - 参考数据数组
 * @returns 百分位值（0-100）
 */
export function calculatePercentile(
  weightKg: number,
  ageMonths: number,
  referenceData: WeightReferencePoint[]
): number {
  // Input validation
  if (!referenceData || referenceData.length === 0) {
    throw new Error('referenceData cannot be empty');
  }

  if (weightKg <= 0) {
    throw new Error('weightKg must be a positive number');
  }

  if (ageMonths < 0) {
    throw new Error('ageMonths cannot be negative');
  }

  const ref = interpolateReferenceAtAge(ageMonths, referenceData);

  // Calculate Z-score using piecewise linear interpolation within [-2SD, +2SD] range
  // Each SD interval has a Z-score range of 1.0 (e.g., -2 to -1, -1 to 0, 0 to 1, 1 to 2)
  // Boundary intervals (< -2SD or > +2SD) have a Z-score range of 0.5
  // because they only cover half a standard deviation on one side

  let z: number;
  if (weightKg <= ref.sd_neg2) {
    // Zone: < -2SD (Z ranges from -2 to -1.5 over 0.5 SD interval)
    const interval = ref.sd_neg2 - ref.sd_neg1;
    const safeInterval = Math.abs(interval) < EPSILON ? EPSILON : interval;
    z = -2 + (weightKg - ref.sd_neg2) / safeInterval * 0.5;
  } else if (weightKg <= ref.sd_neg1) {
    // Zone: -2SD to -1SD (Z ranges from -2 to -1 over 1 SD interval)
    const interval = ref.sd_neg1 - ref.median;
    const safeInterval = Math.abs(interval) < EPSILON ? EPSILON : interval;
    z = -1 + (weightKg - ref.sd_neg1) / safeInterval * 1;
  } else if (weightKg <= ref.median) {
    // Zone: -1SD to median (Z ranges from -1 to 0 over 1 SD interval)
    const interval = ref.sd_neg1 - ref.median;
    const safeInterval = Math.abs(interval) < EPSILON ? EPSILON : interval;
    z = (weightKg - ref.median) / safeInterval;
  } else if (weightKg <= ref.sd_pos1) {
    // Zone: median to +1SD (Z ranges from 0 to +1 over 1 SD interval)
    const interval = ref.sd_pos1 - ref.median;
    const safeInterval = Math.abs(interval) < EPSILON ? EPSILON : interval;
    z = (weightKg - ref.median) / safeInterval;
  } else if (weightKg <= ref.sd_pos2) {
    // Zone: +1SD to +2SD (Z ranges from +1 to +2 over 1 SD interval)
    const interval = ref.sd_pos2 - ref.sd_pos1;
    const safeInterval = Math.abs(interval) < EPSILON ? EPSILON : interval;
    z = 1 + (weightKg - ref.sd_pos1) / safeInterval;
  } else {
    // Zone: > +2SD (Z ranges from +2 to +2.5 over 0.5 SD interval)
    const interval = ref.sd_pos2 - ref.sd_pos1;
    const safeInterval = Math.abs(interval) < EPSILON ? EPSILON : interval;
    z = 2 + (weightKg - ref.sd_pos2) / safeInterval * 0.5;
  }

  return zScoreToPercentile(z);
}
