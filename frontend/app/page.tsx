'use client';

import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { TbBabyBottle, TbStar } from 'react-icons/tb';
import { TfiRulerAlt } from 'react-icons/tfi';
import BannerSection from '@/components/BannerSection';
import WavySeparator from '@/components/WavySeparator';
import FeatureCard from '@/components/FeatureCard';

export default function LandingPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BannerSection
        subtitle={
          <>
            Your partner in parenting
            <br />
            from day one.
          </>
        }
      />

      <WavySeparator />

      <Box
        sx={{
          flex: 1,
          background: 'white',
          position: 'relative',
          zIndex: 2,
          px: 3,
          pb: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => router.push('/login')}
          sx={{
            background: '#786dce',
            borderRadius: '9999px',
            padding: '14px',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            border: 'none',
            boxShadow: '0 4px 12px rgba(155, 143, 200, 0.7)',
            mb: 1.5,
            '&:hover': {
              background: 'linear-gradient(135deg, #8a7eb7 0%, #a794c8 100%)',
            },
          }}
        >
          Get Started
        </Button>

        <Box
          sx={{
            textAlign: 'center',
            color: '#666',
            fontSize: '0.9rem',
            mb: 4,
            cursor: 'pointer',
            '&:hover': {
              color: '#786dce',
            },
          }}
        >
          Learn more about features
        </Box>

        <Box sx={{ mt: 1 }}>
          <FeatureCard
            icon={TbBabyBottle}
            title="Track Feedings"
            description="Log nursing, bottle, and solids easily."
          />
          <FeatureCard
            icon={TfiRulerAlt}
            title="Monitor Growth"
            description="Keep track of height and weight changes."
          />
          <FeatureCard
            icon={TbStar}
            title="Capture Milestones"
            description="Save precious moments and achievements."
          />
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            color: '#888',
            fontSize: '0.8rem',
            mt: 'auto',
            pt: 3,
            maxWidth: 360,
            mx: 'auto',
            lineHeight: 1.5,
          }}
        >
          Track feedings, growth, and milestones with ease
        </Box>
      </Box>
    </Box>
  );
}