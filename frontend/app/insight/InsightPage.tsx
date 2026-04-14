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
