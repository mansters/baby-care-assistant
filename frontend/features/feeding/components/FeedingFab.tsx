'use client';

import { useState } from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FeedingLogDialog from './FeedingLogDialog';

export default function FeedingFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <FeedingLogDialog 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
}
