'use client';

import { Card, CardContent, CardActionArea, Typography } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  backgroundColor: string;
  iconColor: string;
  href: string;
}

export default function FeatureCard({
  icon,
  title,
  subtitle,
  backgroundColor,
  iconColor,
  href,
}: FeatureCardProps) {
  return (
    <Card
      sx={{
        flex: 1,
        backgroundColor,
        borderRadius: '20px',
        boxShadow: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
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
        }}
      >
        <Typography
          component="span"
          sx={{ color: iconColor, fontSize: '28px', display: 'flex', alignItems: 'center' }}
        >
          {icon}
        </Typography>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
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
                color: '#666666',
                fontSize: '12px',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
