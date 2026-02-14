'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton, 
    useMediaQuery,
    useTheme,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import FeedingForm from './FeedingForm';

import { FeedingLog } from '@/lib/types';

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

    const handleSave = async (data: any) => {
        if (!babyId && !initialData?.babyId) return;

        setIsSaving(true);
        try {
            const url = initialData?.id 
                ? `http://localhost:5280/api/feeding/${initialData.id}`
                : 'http://localhost:5280/api/feeding';
            
            const method = initialData?.id ? 'PUT' : 'POST';
            
            const payload = {
                ...initialData, 
                babyId: babyId || initialData?.babyId,
                feedingTime: data.startTime.toISOString(),
                type: data.type === 'Nursing' ? 1 : 0,
                amountMl: 0, 
                durationMinutes: (data.leftDuration || 0) + (data.rightDuration || 0),
                leftBreastDurationMinutes: data.leftDuration || 0,
                rightBreastDurationMinutes: data.rightDuration || 0,
                note: data.note || null
            };

             if (initialData?.id) {
                payload.id = initialData.id;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onClose();
            } else {
                setIsSaving(false);
            }
        } catch (error) {
            console.error(error);
            setIsSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{initialData ? 'Edit Feed' : 'Log New Feed'}</span>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <div style={{ minHeight: '400px' }}>
                     <FeedingForm 
                        onSave={handleSave} 
                        onBack={onClose}
                        isSaving={isSaving}
                        initialData={initialData}
                        isEditing={!!initialData}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}