'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface WeightChartTooltipProps {
  ageLabel: string;      // "3个月15天"
  weightKg: number;      // 6.5
  percentile: number;    // 65.5
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