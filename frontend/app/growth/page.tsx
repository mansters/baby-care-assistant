import * as React from 'react';
import { growthService } from '@/lib/services/growth/growth.service.server';
import { Box, Typography } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { GrowthFab } from '@features/growth';
import GrowthLogSectionList from '@features/growth/components/GrowthLogSectionList';

export default async function GrowthPage() {
  const logs = await growthService.getAll();

  return (
      <Box sx={{ pb: 10, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
            <EqualizerIcon fontSize="large" color="primary" />
            Growth Logs
            </Typography>
        </Box>

        <GrowthLogSectionList logs={logs} />

        <GrowthFab />

      </Box>
  );
}
