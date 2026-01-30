'use client';

import { Authenticator, ThemeProvider, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BannerSection from '@/components/BannerSection';
import WavySeparator from '@/components/WavySeparator';

const formFields = {
  signIn: {
    username: {
      placeholder: 'Username',
      labelHidden: true,
    },
    password: {
      placeholder: 'Password',
      labelHidden: true,
    },
  },
  signUp: {
    username: {
      placeholder: 'Username',
      labelHidden: true,
    },
    email: {
      placeholder: 'Email',
      labelHidden: true,
    },
    password: {
      placeholder: 'Password',
      labelHidden: true,
    },
    confirm_password: {
      placeholder: 'Confirm Password',
      labelHidden: true,
    },
  },
};

function AuthenticatorContent() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/home');
    } else if (authStatus === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [authStatus, router]);

  if (isLoading && authStatus === 'configuring') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#786dce',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

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
            Welcome back!
            <br />
            Please sign in to continue
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
          px: 2,
          pb: 4,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            mx: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            
            '& *': {
              boxSizing: 'border-box',
              maxWidth: '100%',
            },
            
            /* Router */
            '& [data-amplify-authenticator]': {
              '--amplify-components-authenticator-router-border-width': '0',
              '--amplify-components-authenticator-router-box-shadow': 'none',
              '--amplify-colors-background-primary': 'transparent',
              '--amplify-colors-background-secondary': 'transparent',
              width: '100%',
              maxWidth: '100%',
            },
            '& [data-amplify-authenticator] [data-amplify-container]': {
              width: '100%'
            },
            '& [data-amplify-router]': {
              border: 'none',
              boxShadow: 'none',
              background: 'transparent',
              width: '100%',
              maxWidth: '100%',
            },
            '& [data-amplify-form]': {
              padding: 0,
              width: '100%',
            },
            
            /* Tab - pill background */
            '& .amplify-tabs': {
              marginBottom: '2rem',
            },
            '& .amplify-tabs__list': {
              background: '#f2f2f7',
              borderRadius: '25px',
              padding: '4px',
              display: 'flex',
              border: 'none',
              gap: 0,
              width: '100%',
              maxWidth: '100%',
            },
            '& .amplify-tabs__item': {
              flex: 1,
              textAlign: 'center',
              whiteSpace: 'normal',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#666',
              background: 'transparent',
              border: 'none',
              borderRadius: '22px',
              padding: '8px 8px',
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            '& .amplify-tabs__item--active': {
              background: '#786dce',
              color: 'white !important',
              boxShadow: '0 2px 8px rgba(155, 143, 200, 0.7)',
              padding: '12px 8px',
            },
            '& .amplify-tabs__panel': {
              marginTop: '2rem',
              padding: 0,
            },
            
            /* Form spacing */
            '& .amplify-field': {
              marginBottom: '0.75rem',
            },
            '& .amplify-label': {
              display: 'none',
            },
            
            /* Input */
            '& .amplify-input': {
              backgroundColor: '#f5f5f8',
              borderRadius: '14px',
              border: 'none',
              padding: '14px 16px',
              fontSize: '0.95rem',
              '&::placeholder': {
                color: '#9ca3af',
              },
              '&:focus': {
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
              },
            },
            /* Password */
            '& .amplify-field-group': {
              border: 'none',
              backgroundColor: '#f5f5f8',
              borderRadius: '9999px',
              overflow: 'hidden',
            },
            
            /* Password toggle button */
            '& .amplify-field-group__outer-end': {
              backgroundColor: '#f5f5f8',
              borderRadius: '0 14px 14px 0',
              display: 'flex',
              alignItems: 'center',
            },
            '& .amplify-field-group__outer-end button': {
              backgroundColor: '#f5f5f8',
              border: 'none',
              color: '#9ca3af',
              padding: '0 12px',
              height: '100%',
              '&:hover': {
                backgroundColor: '#f5f5f8',
                color: '#666',
              },
              '&:focus': {
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
              },
            },
            
            /* Submit button */
            '& .amplify-button--primary': {
              background: '#786dce',
              borderRadius: '25px',
              padding: '14px',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: 'none',
              marginTop: '0.75rem',
              boxShadow: '0 4px 12px rgba(155, 143, 200, 0.7)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8a7eb7 0%, #a794c8 100%)',
              },
            },
            
            /* Forgot password */
            '& .amplify-button--link': {
              color: '#786dce',
              fontSize: '0.8rem',
              fontWeight: 500,
              marginTop: '0.75rem',
              textAlign: 'right',
              display: 'block',
              width: '100%',
              '&:hover': {
                color: '#7d71a8',
                background: 'transparent',
                textDecoration: 'none',
              },
              '&.amplify-alert__dismiss': {
                width: 'unset',
                margin: 0
              }
            },
            
            /* Alert messages */
            '& .amplify-alert': {
              borderRadius: '9999px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            },
          }}
        >
          <Authenticator
            formFields={formFields}
            loginMechanisms={['username']}
            signUpAttributes={['email']}
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

export default function LoginPage() {
  return (
    <ThemeProvider>
      <Authenticator.Provider>
        <AuthenticatorContent />
      </Authenticator.Provider>
    </ThemeProvider>
  );
}
