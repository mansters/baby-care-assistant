'use client';

import { Box } from '@mui/material';

export default function WavySeparator() {
  return (
    <Box
      sx={{
        position: 'relative',
        marginTop: '-60px',
        zIndex: 1,
        width: '100%',
        height: '60px',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 430 60"
        fill="none"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d="M0 60 L0 30 Q107.5 0 215 30 Q322.5 60 430 30 L430 60 Z"
          fill="white"
        />
      </svg>
    </Box>
  );
}
