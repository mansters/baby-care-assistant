'use client';

import { useState } from 'react';
import { GrowthLog, deleteGrowthLog } from '@/lib/api-client';
import { formatLocal } from '@/lib/date-utils';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    IconButton, 
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GrowthLogDialog from './GrowthLogDialog';
import { useRouter } from 'next/navigation';

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
                        <Card key={log.id} elevation={2} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ pb: '16px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

                                <Box>
                                    <IconButton size="small" onClick={() => setEditingLog(log)} aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => setDeletingId(log.id)} aria-label="delete" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
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
