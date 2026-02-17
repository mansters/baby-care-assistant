'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { Snackbar, Alert } from '@mui/material';
import GrowthForm from '@/features/growth/components/GrowthForm';
import { FeatureTheme } from '@/lib/theme';
import type { GrowthFormValues } from '@/lib/schemas/growth.schema';
import FormPageFrame from '@/shared/components/FormPageFrame';
import { updateGrowthLog } from '../actions';
import { GrowthLog } from '@/lib/types';

interface EditGrowthClientProps {
    initialData: GrowthLog;
}

export default function EditGrowthClient({ initialData }: EditGrowthClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const handleSave = async (data: GrowthFormValues) => {
        setIsSaving(true);
        try {
            await updateGrowthLog(initialData.id, data, initialData.babyId, '/logs');
        } catch (error) {
            if (isRedirectError(error)) {
                throw error;
            }
            console.error('Error updating growth:', error);
            setSnackbar({ open: true, message: 'Failed to update growth log.', severity: 'error' });
            setIsSaving(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formInitialData: Partial<GrowthFormValues> = {
        startTime: new Date(initialData.dateMeasured),
        weightKg: initialData.weightKg,
        heightCm: initialData.heightCm ?? undefined,
        headCircumferenceCm: initialData.headCircumferenceCm ?? undefined,
        note: initialData.note || '',
    };

    return (
        <FormPageFrame
            title="Edit Growth"
            themeColor={FeatureTheme.growth.primary}
            onBack={() => router.push('/logs')}
            formId="growth-form"
            isSaving={isSaving}
        >
            <GrowthForm
                onSubmit={handleSave}
                initialData={formInitialData}
                isEditing={true}
            />
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
