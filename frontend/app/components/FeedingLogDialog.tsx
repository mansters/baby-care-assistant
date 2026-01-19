'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton, 
    useMediaQuery,
    useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close'; 
import FeedingForm from './FeedingForm';

export default function FeedingLogDialog() {
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpen}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000
                }}
            >
                <AddIcon />
            </Fab>

            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={isMobile}
                fullWidth
                maxWidth="sm"
            >
                {}
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Log New Feed</span>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <FeedingForm onSuccess={handleClose} />
                </DialogContent>
            </Dialog>
        </>
    );
}