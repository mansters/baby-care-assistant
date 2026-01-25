'use client';

import { Box, Typography, Stack, ListItemButton, Divider } from '@mui/material';
import { GrowthLog } from '@/lib/api-client';
import { getOrdinalSuffix } from '@shared/utils/date-utils';
import { format } from 'date-fns';

interface GrowthLogRowProps {
    log: GrowthLog;
    onClick: () => void;
    showDivider?: boolean;
}


export default function GrowthLogRow({ log, onClick, showDivider = false }: GrowthLogRowProps) {
    const date = new Date(log.dateMeasured);
    const dayNum = date.getDate();
    const suffix = getOrdinalSuffix(dayNum);

    return (
        <Box component="li">
            <ListItemButton onClick={onClick} sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 2,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center', 
                    minHeight: '80px',
                }}>
                    <Box sx={{ 
                        minWidth: '80px', 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        <Typography 
                            sx={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold', 
                                color: 'text.secondary',
                                lineHeight: 1,
                                fontVariantNumeric: 'tabular-nums'
                            }}
                        >
                            {dayNum}
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontSize: '0.9rem', 
                                fontWeight: 'bold', 
                                color: 'text.secondary',
                                mt: 0.5,
                                lineHeight: 1
                            }}
                        >
                            {suffix}
                        </Typography>
                    </Box>
                    
                    {/* Right Column: Content */}
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                        {/* Day of Week */}
                        <Typography variant="body2" color="text.secondary">
                            {format(date, 'EEEE')}
                        </Typography>

                        {/* Weight Value */}
                        <Typography 
                            variant="h5" 
                            fontWeight="bold" 
                            color="text.primary"
                            sx={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {log.weightKg.toFixed(2)} kg
                        </Typography>

                        {/* Stats Line */}
                        {(!!log.heightCm || !!log.headCircumferenceCm) && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                {log.heightCm && `H: ${log.heightCm.toFixed(2)} cm`}
                                {log.heightCm && log.headCircumferenceCm && ' • '}
                                {log.headCircumferenceCm && `Head: ${log.headCircumferenceCm.toFixed(2)} cm`}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </ListItemButton>
            {showDivider && <Divider variant="inset" component="li" />}
        </Box>
    );
}
