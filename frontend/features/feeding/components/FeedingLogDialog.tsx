'use client';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton, 
    useMediaQuery,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import FeedingForm from './FeedingForm';

import { FeedingLog } from '@/lib/api-client';

interface FeedingLogDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: FeedingLog | null;
}

export default function FeedingLogDialog({ open, onClose, initialData }: FeedingLogDialogProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                <FeedingForm onSuccess={onClose} initialData={initialData || undefined} />
            </DialogContent>
        </Dialog>
    );
}