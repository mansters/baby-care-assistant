function zScoreToPercentile(z) {
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

console.log("Z=0: ", zScoreToPercentile(0));
console.log("Z=0.096: ", zScoreToPercentile(0.096));
console.log("Z=1: ", zScoreToPercentile(1));
console.log("Z=-1: ", zScoreToPercentile(-1));
