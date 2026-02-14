'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FeedingForm from '@/features/feeding/components/FeedingForm';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { FeatureTheme } from '@/lib/theme';

export default function EditFeedingPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);
    const [babyId, setBabyId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:5280/api/feeding/${id}`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch details');
                return res.json();
            })
            .then(data => {
                setInitialData({
                    startTime: data.feedingTime,
                    leftBreastDurationMinutes: data.leftBreastDurationMinutes,
                    rightBreastDurationMinutes: data.rightBreastDurationMinutes,
                    type: data.type === 1 ? 'Nursing' : 'Bottle',
                    note: data.note, 
                    amountMl: data.amountMl
                });
                setBabyId(data.babyId);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching feeding:', err);
                setSnackbar({ open: true, message: 'Failed to load feeding details.', severity: 'error' });
                setLoading(false);
            });

    }, [id]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async (data: any) => {
        if (!babyId || !id) return;

        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:5280/api/feeding/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
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
                setSnackbar({ open: true, message: 'Feeding updated successfully!', severity: 'success' });
                setTimeout(() => {
                    router.push('/home');
                }, 1500);
            } else {
                setSnackbar({ open: true, message: 'Failed to update feeding.', severity: 'error' });
                setIsSaving(false);
            }
        } catch (error) {
            console.error('Error updating feeding log:', error);
            setSnackbar({ open: true, message: 'Error updating feeding log.', severity: 'error' });
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <Box className="h-screen w-full flex items-center justify-center bg-white">
                <CircularProgress sx={{ color: FeatureTheme.feeding.primary }} />
            </Box>
        );
    }

    if (!initialData) {
        return (
             <Box className="h-screen w-full flex items-center justify-center bg-white">
                <div>Feeding log not found.</div>
            </Box>
        );
    }

    return (
        <>
            <FeedingForm 
                onSave={handleSave} 
                onBack={() => router.back()} 
                isSaving={isSaving} 
                initialData={initialData}
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
        </>
    );
}
