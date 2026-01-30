'use client';

import { Box } from '@mui/material';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: '#f0eef8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={24} color="#736e9b" />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: '#333',
            mb: 0.25,
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            fontSize: '0.85rem',
            color: '#666',
            lineHeight: 1.4,
          }}
        >
          {description}
        </Box>
      </Box>
    </Box>
  );
}
