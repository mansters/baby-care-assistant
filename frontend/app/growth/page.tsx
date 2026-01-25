import * as React from 'react';
import { getGrowthLogs } from '@/lib/api-client';
import { Container, Typography, Box, Button } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DashboardFab from '../components/DashboardFab';
import GrowthLogList from '../components/GrowthLogList';

export default async function GrowthPage() {
  const logs = await getGrowthLogs();

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
          <EqualizerIcon fontSize="large" color="primary" />
          Growth Logs
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Button variant="contained" href="/growth/grouped">
                View Grouped Cards
            </Button>
            <Button variant="contained" href="/growth/section">
                View Section List
            </Button>
        </Box>

        <Typography variant="h6" gutterBottom>Original List:</Typography>
        <GrowthLogList logs={logs} />

        <DashboardFab />

      </Container>
  );
}
