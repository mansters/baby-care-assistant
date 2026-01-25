import * as React from 'react';
import { getGrowthLogs } from '@/lib/api-client';
import { Container, Typography, Box, Button } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DashboardFab from '../../components/DashboardFab';
import GrowthLogSectionList from '../../components/GrowthLogSectionList';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default async function GrowthSectionPage() {
  const logs = await getGrowthLogs();

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 10, px: { xs: 0, sm: 2 } }}>
        <Box sx={{ mb: 2, px: 2 }}>
            <Link href="/growth" passHref>
                <Button startIcon={<ArrowBackIcon />}>Back to Growth Options</Button>
            </Link>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
          <EqualizerIcon fontSize="large" color="primary" />
          Growth Logs (Section)
        </Typography>

        <GrowthLogSectionList logs={logs} />

        <DashboardFab />

      </Container>
  );
}
