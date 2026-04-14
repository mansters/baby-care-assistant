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
