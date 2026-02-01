'use client';

import {
    Drawer,
    Box,
    Typography,
    Stack,
    Button,
    Divider,
    IconButton
} from '@mui/material';
import { GrowthLog } from '@/lib/types';
import { format } from 'date-fns';

interface GrowthDetailSheetProps {
    open: boolean;
    onClose: () => void;
    log: GrowthLog | null;
    onEdit: (log: GrowthLog) => void;
    onDelete: (log: GrowthLog) => void;
}

export default function GrowthDetailSheet({
    open,
    onClose,
    log,
    onEdit,
    onDelete
}: GrowthDetailSheetProps) {
    if (!log) return null;

    const dateMeasured = new Date(log.dateMeasured);
    const formattedDate = format(dateMeasured, 'EEEE, d MMM yyyy');

    const handleEdit = () => {
        onEdit(log);
        onClose();
    };

    const handleDelete = () => {
        onDelete(log);
        onClose();
    };

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    p: 0,
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 1 }}>
                <Box
                    sx={{
                        width: 32,
                        height: 4,
                        bgcolor: 'grey.300',
                        borderRadius: 2
                    }}
                />
            </Box>

            <Box sx={{ px: 3, pb: 4 }}>
                <Typography variant="h6" align="center" sx={{ mb: 3 }}>
                    {formattedDate}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography variant="h2" component="div" fontWeight="bold">
                        {log.weightKg.toFixed(2)} <Typography component="span" variant="h4" color="text.secondary" fontWeight="normal">kg</Typography>
                    </Typography>
                </Box>

                {(!!log.heightCm || !!log.headCircumferenceCm) && (
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4, color: 'text.secondary' }}>
                        {!!log.heightCm && (
                            <Typography variant="body1">
                                H: {log.heightCm} cm
                            </Typography>
                        )}
                        {!!log.heightCm && !!log.headCircumferenceCm && (
                            <Typography variant="body1">•</Typography>
                        )}
                        {!!log.headCircumferenceCm && (
                            <Typography variant="body1">
                                Head: {log.headCircumferenceCm} cm
                            </Typography>
                        )}
                    </Stack>
                )}

                {log.note && (
                    <>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Note
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                {log.note}
                            </Typography>
                        </Box>
                    </>
                )}

                <Divider sx={{ mb: 4 }} />

                <Stack spacing={2}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleEdit}
                        sx={{ 
                            py: 1.5, 
                            bgcolor: '#1976d2',
                            borderRadius: 28,
                            fontWeight: 'bold'
                        }}
                    >
                        UPDATE ENTRY
                    </Button>
                    
                    <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        onClick={handleDelete}
                        color="error"
                        sx={{ 
                            py: 1.5, 
                            borderRadius: 28,
                            fontWeight: 'bold',
                            borderWidth: 1.5,
                            '&:hover': { borderWidth: 1.5 }
                        }}
                    >
                        DELETE RECORD
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
