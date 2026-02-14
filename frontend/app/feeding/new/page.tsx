'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FeedingForm from '@/features/feeding/components/FeedingForm';
import { Snackbar, Alert } from '@mui/material';

export default function FeedingPage() {
    const router = useRouter();
    const [babyId, setBabyId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetch('http://localhost:5280/api/Baby')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setBabyId(data[0].id);
                }
            })
            .catch(err => console.error('Failed to fetch babies', err));
    }, []);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async (data: any) => {
        if (!babyId) {
            console.error('No baby selected');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:5280/api/feeding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    babyId: babyId, 
                    feedingTime: data.startTime.toISOString(),
                    type: data.type === 'Nursing' ? 1 : 0,
                    amountMl: 0, 
                    durationMinutes: (data.leftDuration || 0) + (data.rightDuration || 0),
                    leftBreastDurationMinutes: data.leftDuration || 0,
                    rightBreastDurationMinutes: data.rightDuration || 0,
                    note: data.note || null
                }),
            });

            if (response.ok) {
                setSnackbar({ open: true, message: 'Feeding saved successfully!', severity: 'success' });
                setTimeout(() => {
                    router.push('/home');
                }, 1500);
            } else {
                setSnackbar({ open: true, message: 'Failed to save feeding.', severity: 'error' });
                setIsSaving(false);
            }
        } catch (error) {
            console.error('Error saving feeding log:', error);
            setSnackbar({ open: true, message: 'Error saving feeding log.', severity: 'error' });
            setIsSaving(false);
        }
    };

    return (
        <>
            <FeedingForm onSave={handleSave} onBack={() => router.back()} isSaving={isSaving} />
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
        </>
    );
}