'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface WeightChartTooltipProps {
  ageLabel: string;      // "3个月15天"
  weightKg: number;      // 6.5
  percentile: number;    // 65.5
  visible: boolean;
  leftPosition?: string;
}

export default function WeightChartTooltip({
  ageLabel,
  weightKg,
  percentile,
  visible,
  leftPosition,
}: WeightChartTooltipProps) {
  if (!visible) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 35,
        left: leftPosition || '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: 100,
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <Typography
        sx={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#66BB6A',
          lineHeight: 1.1,
        }}
      >
        {weightKg.toFixed(1)}kg
      </Typography>
      <Typography
        sx={{ fontSize: '11px', color: '#999999', mt: 0.5 }}
      >
        {ageLabel}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#333333',
          mt: 0.5,
        }}
      >
        {percentile.toFixed(0)}%
      </Typography>
    </Paper>
  );
}