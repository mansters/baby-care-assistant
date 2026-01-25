import * as React from 'react';
import { getGrowthLogs } from '@/lib/api-client';
import { Container, Typography, Box, Button } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DashboardFab from '../../components/DashboardFab';
import GrowthLogGroupedList from '../../components/GrowthLogGroupedList';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default async function GrowthGroupedPage() {
  const logs = await getGrowthLogs();

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
        <Box sx={{ mb: 2 }}>
            <Link href="/growth" passHref>
                <Button startIcon={<ArrowBackIcon />}>Back to Growth Options</Button>
            </Link>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
          <EqualizerIcon fontSize="large" color="primary" />
          Growth Logs (Grouped)
        </Typography>

        <GrowthLogGroupedList logs={logs} />

        <DashboardFab />

      </Container>
  );
}
