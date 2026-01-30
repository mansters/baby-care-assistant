'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import { LuBaby } from 'react-icons/lu';

interface BannerSectionProps {
  subtitle: React.ReactNode;
}

export default function BannerSection({ subtitle }: BannerSectionProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '38vh',
        minHeight: 280,
        width: '100%',
        flexShrink: 0,
      }}
    >
      <Image
        src="/imgs/login-banner.png"
        alt="BabyCare Banner"
        fill
        priority
        style={{ objectFit: 'cover' }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 2,
          pb: 8,
        }}
      >
        <Box 
          sx={{ 
            mb: 1.5,
            width: 96,
            height: 96,
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <LuBaby size={72} color="#8381AD" />
        </Box>
        
        <Box
          component="h1"
          sx={{
            color: 'white',
            fontSize: '1.75rem',
            fontWeight: 600,
            m: 0,
            mb: 0.5,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          BabyCare
        </Box>
        <Box
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '0.875rem',
            textAlign: 'center',
            lineHeight: 1.4,
            px: 2,
          }}
        >
          {subtitle}
        </Box>
      </Box>
    </Box>
  );
}
