'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton, 
    useMediaQuery,
    useTheme,
    Button,
    CircularProgress,
    DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import FeedingForm from './FeedingForm';
import { FeedingLog, CreateFeedingLogRequest, UpdateFeedingLogRequest } from '@/lib/types';
import { feedingService } from '@/lib/services/feeding/feeding.service.client';
import { FeedingFormValues } from '@/lib/schemas/feeding.schema';
import { FeatureTheme } from '@/lib/theme';

interface FeedingLogDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: FeedingLog | null;
}

export default function FeedingLogDialog({ open, onClose, initialData }: FeedingLogDialogProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [isSaving, setIsSaving] = useState(false);
    const [babyId, setBabyId] = useState<string | null>(initialData?.babyId || null);

    useEffect(() => {
        if (open && !initialData && !babyId) {
            fetch('http://localhost:5280/api/Baby')
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        setBabyId(data[0].id);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [open, initialData, babyId]);

    const handleSave = async (data: FeedingFormValues) => {
        if (!babyId && !initialData?.babyId) return;

        setIsSaving(true);
        try {
            const requestData = {
                babyId: babyId || initialData!.babyId,
                feedingTime: data.startTime.toISOString(),
                type: data.type === 'Nursing' ? 1 : 0,
                amountMl: data.amountMl || 0,
                durationMinutes: (data.leftDuration || 0) + (data.rightDuration || 0),
                leftBreastDurationMinutes: data.leftDuration || 0,
                rightBreastDurationMinutes: data.rightDuration || 0,
                note: data.note || undefined
            };

            if (initialData?.id) {
                await feedingService.update(initialData.id, { ...requestData, id: initialData.id } as UpdateFeedingLogRequest);
            } else {
                await feedingService.create(requestData as CreateFeedingLogRequest);
            }

            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Prepare initial form values from prop
    const formInitialData = initialData ? {
        startTime: new Date(initialData.feedingTime),
        type: (initialData.type === 1 ? 'Nursing' : 'Bottle') as 'Nursing' | 'Bottle',
        leftDuration: initialData.leftBreastDurationMinutes || 0,
        rightDuration: initialData.rightBreastDurationMinutes || 0,
        amountMl: initialData.amountMl || 0,
        note: initialData.note || '',
    } : undefined;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: FeatureTheme.feeding.primary, color: 'white' }}>
                <span className="font-semibold text-lg">{initialData ? 'Edit Feed' : 'Log New Feed'}</span>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers className="p-0">
                <FeedingForm 
                    onSubmit={handleSave} 
                    initialData={formInitialData}
                    isEditing={!!initialData}
                />
            </DialogContent>
            
            <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
                <Button 
                    type="submit" 
                    form="feeding-form" 
                    disabled={isSaving}
                    fullWidth
                    variant="contained"
                    sx={{
                        bgcolor: FeatureTheme.feeding.primary,
                        height: 48,
                        borderRadius: 9999,
                        fontSize: 16,
                        fontWeight: 600,
                        textTransform: 'none'
                    }}
                >
                    {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}