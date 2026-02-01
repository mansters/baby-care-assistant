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
import GrowthForm from './GrowthForm';

import { GrowthLog } from "@/lib/types";

interface GrowthLogDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: GrowthLog;
}

export default function GrowthLogDialog({ open, onClose, initialData }: GrowthLogDialogProps) {
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
                <span>Log Growth</span>
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
                <GrowthForm onSuccess={onClose} initialData={initialData} />
            </DialogContent>
        </Dialog>
    );
}
