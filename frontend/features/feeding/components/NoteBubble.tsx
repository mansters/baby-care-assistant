import { Box, Typography } from '@mui/material';

const NOTE_BG_COLOR = '#f7f7f7';

interface NoteBubbleProps {
    note: string;
    marginLeft?: string;
}

export function NoteBubble({ note, marginLeft = '72px' }: NoteBubbleProps) {
    return (
        <Box sx={{ 
            ml: marginLeft,
            mt: 1.5,
            position: 'relative',
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: -8,
                    left: 8,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: `8px solid ${NOTE_BG_COLOR}`,
                }}
            />
            <Box 
                sx={{ 
                    bgcolor: NOTE_BG_COLOR,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                }}
            >
                <Typography 
                    variant="body2" 
                    sx={{ color: 'text.secondary' }}
                >
                    {note}
                </Typography>
            </Box>
        </Box>
    );
}
