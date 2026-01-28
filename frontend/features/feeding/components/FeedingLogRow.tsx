import { Box, Typography, ListItemButton, Divider } from '@mui/material';
import { FeedingLog, FeedingType } from '@/lib/api-client';
import { format } from 'date-fns';
import { FeedingTypeIcon } from './FeedingTypeIcon';
import { NoteBubble } from './NoteBubble';

interface FeedingLogRowProps {
    log: FeedingLog;
    onClick: () => void;
    showDivider?: boolean;
}

function getDetailsText(log: FeedingLog): string {
    switch (log.type) {
        case FeedingType.Bottle:
            return `${log.amountMl} ml Formula`;
        case FeedingType.Breast:
            return `${log.durationMinutes} min`;
        case FeedingType.Solids:
            return 'Solids';
        default:
            return `${log.amountMl} ml`;
    }
}

export default function FeedingLogRow({ log, onClick, showDivider = false }: FeedingLogRowProps) {
    const timeStr = format(new Date(log.feedingTime), 'HH:mm');

    return (
        <>
            <ListItemButton component="li" onClick={onClick} sx={{ p: 0 }}>
                <Box sx={{ px: 2, py: 1.5, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography 
                            sx={{ 
                                fontSize: '1.1rem', 
                                fontWeight: 700, 
                                color: 'text.primary',
                                minWidth: '60px',
                            }}
                        >
                            {timeStr}
                        </Typography>

                        <FeedingTypeIcon type={log.type} />

                        <Typography 
                            sx={{ 
                                fontWeight: 700,
                                color: 'text.primary',
                                fontSize: '1rem',
                            }}
                        >
                            {getDetailsText(log)}
                        </Typography>
                    </Box>

                    {log.note && <NoteBubble note={log.note} />}
                </Box>
            </ListItemButton>
            {showDivider && <Divider variant="inset" component="li" />}
        </>
    );
}
