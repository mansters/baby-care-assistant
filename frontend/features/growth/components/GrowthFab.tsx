'use client';

import { useState } from 'react';
import { Fab, Zoom, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GrowthLogDialog from './GrowthLogDialog';

export default function GrowthFab() {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <>
            <Zoom
                in={true}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${transitionDuration.exit}ms`,
                }}
                unmountOnExit
            >
                <Fab
                    color="primary"
                    aria-label="add growth log"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    <AddIcon />
                </Fab>
            </Zoom>

            <GrowthLogDialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
