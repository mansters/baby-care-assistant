'use client';

import { useState } from 'react';
import { GrowthLog, deleteGrowthLog } from '@/lib/api-client';
import { getOrdinalSuffix } from '@/lib/date-utils';
import { 
    Box, 
    Typography, 
    Stack,
    Divider
} from '@mui/material';
import GrowthLogDialog from './GrowthLogDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useRouter } from 'next/navigation';
import SwipeableItem from './SwipeableItem';
import { format } from 'date-fns';
import { useGroupedLogs } from '@/hooks/useGroupedLogs';

interface GrowthLogGroupedListProps {
    logs: GrowthLog[];
}

export default function GrowthLogGroupedList({ logs }: GrowthLogGroupedListProps) {
    const router = useRouter();
    const [editingLog, setEditingLog] = useState<GrowthLog | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const groupedLogs = useGroupedLogs(logs);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteGrowthLog(deletingId);
            setDeletingId(null);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete log', error);
            alert('Failed to delete log');
        }
    };

    return (
        <Box sx={{ pb: 10 }}>
            {logs.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                    No growth logs found.
                </Typography>
            ) : (
                <Stack spacing={0}>
                    {groupedLogs.map((group) => (
                        <Box key={group.monthKey}>
                            {/* Group Header */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                px: 2, 
                                py: 1,
                            }}>
                                <Typography 
                                    variant="subtitle2" 
                                    color="text.secondary" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {format(group.date, 'MMMM yyyy')}
                                </Typography>
                                {group.weightChange !== null && typeof group.weightChange === 'number' && (
                                    <Typography variant="caption" color={group.weightChange > 0 ? "success.main" : "text.secondary"} fontWeight="bold">
                                        {group.weightChange > 0 ? '+' : ''}{group.weightChange.toFixed(2)} kg
                                    </Typography>
                                )}
                            </Box>
                            
                            {/* List Items */}
                            <Stack divider={<Divider sx={{ ml: 2 }} />}>
                                {group.logs.map((log) => {
                                    const date = new Date(log.dateMeasured);
                                    const dayNum = date.getDate();
                                    const suffix = getOrdinalSuffix(dayNum);

                                    return (
                                        <Box key={log.id}>
                                            <SwipeableItem
                                                onEdit={() => setEditingLog(log)}
                                                onDelete={() => setDeletingId(log.id)}
                                            >
                                                {() => (
                                                    <Box sx={{ 
                                                        p: 2,
                                                        transition: 'background-color 0.2s',
                                                        bgcolor: 'background.paper',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        minHeight: '80px',
                                                    }}>
                                                        {/* Left Column: Big Date */}
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
                                                )}
                                            </SwipeableItem>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}

            {/* Edit Dialog */}
            {editingLog && (
                <GrowthLogDialog
                    open={true}
                    onClose={() => setEditingLog(null)}
                    initialData={editingLog}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmDeleteDialog
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDelete}
                title="Delete Record?"
                message="Are you sure you want to delete this growth record?"
            />
        </Box>
    );
}
