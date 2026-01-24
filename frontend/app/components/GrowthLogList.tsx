'use client';

import { useState } from 'react';
import { GrowthLog, deleteGrowthLog } from '@/lib/api-client';
import { formatLocal } from '@/lib/date-utils';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Stack
} from '@mui/material';
import GrowthLogDialog from './GrowthLogDialog';
import { useRouter } from 'next/navigation';
import SwipeableItem from './SwipeableItem';

interface GrowthLogListProps {
    logs: GrowthLog[];
}

export default function GrowthLogList({ logs }: GrowthLogListProps) {
    const router = useRouter();
    const [editingLog, setEditingLog] = useState<GrowthLog | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteGrowthLog(deletingId);
            setDeletingId(null);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete log', error);
            alert('Failed to delete log');
        }
    };

    return (
        <Box sx={{ pb: 10 }}>
            {logs.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                    No growth logs found. Click the + button to add one.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {logs.map((log) => (
                        <SwipeableItem
                            key={log.id}
                            onEdit={() => setEditingLog(log)}
                            onDelete={() => setDeletingId(log.id)}
                        >
                            {(swipeDirection) => (
                                <Card 
                                    variant="outlined"
                                    sx={{ 
                                        width: '100%', 
                                        bgcolor: 'background.paper',
                                        position: 'relative',
                                        overflow: 'visible',
                                        transition: 'border-radius 0.2s ease',
                                        // Dynamic border radius based on swipe direction
                                        borderTopRightRadius: swipeDirection === 'left' ? 0 : 8,
                                        borderBottomRightRadius: swipeDirection === 'left' ? 0 : 8,
                                        borderTopLeftRadius: swipeDirection === 'right' ? 0 : 8,
                                        borderBottomLeftRadius: swipeDirection === 'right' ? 0 : 8,
                                        // Ensure default is 8px (2 * 4px) when no swipe
                                        borderRadius: swipeDirection === 'none' ? 2 : undefined
                                    }}
                                >
                                    <CardContent sx={{ pb: '16px !important', textAlign: 'left' }}>
                                        <Box>
                                            <Typography variant="h6" component="div" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                                                {formatLocal(log.dateMeasured, 'MMM d, yyyy h:mm a')}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Typography variant="body1">
                                                    <strong>Weight:</strong> {log.weightKg} kg
                                                </Typography>
                                                {!!log.heightCm && (
                                                    <Typography variant="body1">
                                                        <strong>Height:</strong> {log.heightCm} cm
                                                    </Typography>
                                                )}
                                                {!!log.headCircumferenceCm && (
                                                    <Typography variant="body1">
                                                        <strong>Head Circ:</strong> {log.headCircumferenceCm} cm
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </SwipeableItem>
                    ))}
                </Stack>
            )}

            {/* Edit Dialog */}
            {editingLog && (
                <GrowthLogDialog
                    open={true}
                    onClose={() => setEditingLog(null)}
                    initialData={editingLog}
                />
            )}

            {/* Delete Confirmation */}
            <Dialog
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
            >
                <DialogTitle>Delete Record?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this growth record? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletingId(null)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
