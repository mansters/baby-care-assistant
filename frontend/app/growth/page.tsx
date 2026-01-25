import * as React from 'react';
import { getGrowthLogs } from '@/lib/api-client';
import { Box, Typography } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DashboardFab from '../components/DashboardFab';
import GrowthLogSectionList from '@features/growth/components/GrowthLogSectionList';

export default async function GrowthPage() {
  const logs = await getGrowthLogs();

  return (
      <Box sx={{ pb: 10, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
            <EqualizerIcon fontSize="large" color="primary" />
            Growth Logs
            </Typography>
        </Box>

        <GrowthLogSectionList logs={logs} />

        <DashboardFab />

      </Box>
  );
}
