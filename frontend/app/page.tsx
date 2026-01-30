import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
          }}
        >
          <ChildCareIcon
            sx={{
              fontSize: 80,
              color: 'primary.main',
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            BabyCare Assistant
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Track feedings, growth, and milestones for your little one
          </Typography>
          <Link href="/login" passHref legacyBehavior>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
              }}
            >
              Get Started
            </Button>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}