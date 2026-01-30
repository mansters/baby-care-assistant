'use client';

import { Authenticator, ThemeProvider, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuBaby } from 'react-icons/lu';

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
          background: '#9B8FC8',
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
            }}
          >
            Welcome back!
            <br />
            Please sign in to continue
          </Box>
        </Box>
      </Box>

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
              background: '#9B8FC8',
              color: 'white !important',
              boxShadow: '0 2px 8px rgba(155, 143, 200, 0.35)',
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
              background: 'linear-gradient(135deg, #9B8FC8 0%, #B8A5D9 100%)',
              borderRadius: '25px',
              padding: '14px',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: 'none',
              marginTop: '0.75rem',
              boxShadow: '0 4px 12px rgba(155, 143, 200, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8a7eb7 0%, #a794c8 100%)',
              },
            },
            
            /* Forgot password */
            '& .amplify-button--link': {
              color: '#9B8FC8',
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
            className="w-full"
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
