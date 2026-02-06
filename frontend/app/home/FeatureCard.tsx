'use client';

import { Card, CardActionArea, Typography, Box, Stack } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  backgroundColor: string;
  iconColor: string;
  href: string;
  badge?: string;
  isOverdue?: boolean;
}

export default function FeatureCard({
  icon,
  title,
  subtitle,
  backgroundColor,
  iconColor,
  href,
  badge,
  isOverdue = false,
}: FeatureCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        flex: 1,
        backgroundColor,
        borderRadius: '20px',
        boxShadow: 'none',
      }}
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          height: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          p: 2,
          '&:focus-visible': {
            outline: 'none',
            boxShadow: 'none',
          },
          '&.Mui-focusVisible': {
            boxShadow: 'none',
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ width: '100%' }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
            }}
          >
            {icon}
          </Box>
          {badge && (
            <Box
              sx={{
                backgroundColor: isOverdue ? '#E53935' : iconColor,
                borderRadius: '10px',
                px: 1,
                py: 0.375,
              }}
            >
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {badge}
              </Typography>
            </Box>
          )}
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#1A1A2E',
              fontSize: '16px',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: isOverdue ? '#E53935' : '#666666',
                fontSize: isOverdue ? '10px' : '12px',
                fontWeight: isOverdue ? 600 : 'normal',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
