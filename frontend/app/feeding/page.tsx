import * as React from 'react';
import { feedingService } from '@/lib/services/feeding/feeding.service.server';
import { Container, Typography } from '@mui/material';
import FeedingFab from '@/features/feeding/components/FeedingFab';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FeedingLogSectionList from '@/features/feeding/components/FeedingLogSectionList';

export default async function FeedingPage() {
  const logs = await feedingService.getAll();

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 10, bgcolor: 'background.default', minHeight: '100vh', px: 0 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
          <ChildCareIcon fontSize="large" color="primary" />
          Feeding Log
        </Typography>

        <FeedingLogSectionList logs={logs} />

        <FeedingFab />
      </Container>
  );
}
