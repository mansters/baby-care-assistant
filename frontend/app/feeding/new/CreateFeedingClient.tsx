'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { Snackbar, Alert } from '@mui/material';
import FeedingForm from '@/features/feeding/components/FeedingForm';
import { FeatureTheme } from '@/lib/theme';
import type { FeedingFormValues } from '@/lib/schemas/feeding.schema';
import FormPageFrame from '@/shared/components/FormPageFrame';
import { createFeedingLog } from '../actions';

interface CreateFeedingClientProps {
    babyId: string;
}

export default function CreateFeedingClient({ babyId }: CreateFeedingClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const handleSave = async (data: FeedingFormValues) => {
        setIsSaving(true);
        try {
            await createFeedingLog(data, babyId);
        } catch (error) {
            if (isRedirectError(error)) {
                throw error;
            }
            console.error(error);
            setSnackbar({ open: true, message: 'Failed to save feeding.', severity: 'error' });
            setIsSaving(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <FormPageFrame
            title="Add Feeding"
            themeColor={FeatureTheme.feeding.primary}
            onBack={() => router.push('/home')}
            formId="feeding-form"
            isSaving={isSaving}
        >
            <FeedingForm onSubmit={handleSave} />
            
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </FormPageFrame>
    );
}
