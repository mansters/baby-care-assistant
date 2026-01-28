'use client';

import {
    Drawer,
    Box,
    Typography,
    Stack,
    Button,
} from '@mui/material';
import { FeedingLog, FeedingType } from '@/lib/api-client';
import { format } from 'date-fns';
import { FeedingTypeLargeIcon, getFeedingLabel } from './FeedingTypeIcon';
import { MdAccessTime } from 'react-icons/md';

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
    const formattedDateTime = format(feedingTime, "EEEE, d MMM yyyy • h:mm a");
    const typeLabel = getFeedingLabel(log.type);

    const handleEdit = () => {
        onEdit(log);
        onClose();
    };

    const handleDelete = () => {
        onDelete(log);
        onClose();
    };

    const renderMainContent = () => {
        if (log.type === FeedingType.Bottle) {
            return (
                <>
                    <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {log.amountMl} ml
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {typeLabel}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <MdAccessTime size={18} />
                        <Typography variant="body2">{log.durationMinutes} min</Typography>
                    </Box>
                </>
            );
        }
        
        if (log.type === FeedingType.Breast) {
            return (
                <>
                    <Typography variant="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {log.durationMinutes} min
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {typeLabel}
                    </Typography>
                </>
            );
        }

        return (
            <>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {typeLabel}
                </Typography>
                {log.durationMinutes > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <MdAccessTime size={18} />
                        <Typography variant="body2">{log.durationMinutes} min</Typography>
                    </Box>
                )}
            </>
        );
    };

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    maxHeight: '80vh',
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 1 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 4,
                        bgcolor: 'grey.300',
                        borderRadius: 2
                    }}
                />
            </Box>

            <Box sx={{ px: 3, pb: 4 }}>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                    {formattedDateTime}
                </Typography>

                <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
                    <FeedingTypeLargeIcon type={log.type} />
                    {renderMainContent()}
                </Stack>

                {log.note && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                            Note
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {log.note}
                        </Typography>
                    </Box>
                )}

                <Stack spacing={1.5}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleEdit}
                        sx={{ 
                            py: 1.5, 
                            bgcolor: '#2196F3',
                            borderRadius: 1,
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            '&:hover': { bgcolor: '#1976d2' }
                        }}
                    >
                        Update Entry
                    </Button>
                    
                    <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        onClick={handleDelete}
                        sx={{ 
                            py: 1.5, 
                            borderRadius: 1,
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            color: '#d32f2f',
                            borderColor: '#d32f2f',
                            borderWidth: 2,
                            '&:hover': { 
                                borderWidth: 2,
                                borderColor: '#b71c1c',
                                bgcolor: 'rgba(211, 47, 47, 0.04)'
                            }
                        }}
                    >
                        Delete Record
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
