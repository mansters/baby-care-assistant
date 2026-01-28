'use client';

import {
    Drawer,
    Box,
    Typography,
    Stack,
    Button,
    Divider,
    Chip
} from '@mui/material';
import { FeedingLog, FeedingType } from '@/lib/api-client';
import { format } from 'date-fns';
import { getFeedingTypeConfig } from '@/app/utils/enums';

interface FeedingDetailSheetProps {
    open: boolean;
    onClose: () => void;
    log: FeedingLog | null;
    onEdit: (log: FeedingLog) => void;
    onDelete: (log: FeedingLog) => void;
}

export default function FeedingDetailSheet({
    open,
    onClose,
    log,
    onEdit,
    onDelete
}: FeedingDetailSheetProps) {
    if (!log) return null;

    const feedingTime = new Date(log.feedingTime);
    const formattedDate = format(feedingTime, 'EEEE, d MMM yyyy');
    const formattedTime = format(feedingTime, 'HH:mm');
    const typeConfig = getFeedingTypeConfig(Number(log.type));

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

                {/* Main Value - Amount */}
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography variant="h2" component="div" fontWeight="bold">
                        {log.amountMl} <Typography component="span" variant="h4" color="text.secondary" fontWeight="normal">ml</Typography>
                    </Typography>
                </Box>

                {/* Secondary Values */}
                <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Chip 
                        label={typeConfig.label} 
                        color={typeConfig.color} 
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                    
                    <Typography variant="body1" color="text.secondary">
                        {formattedTime} • {log.durationMinutes} min
                    </Typography>
                </Stack>

                {/* Note Section */}
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
