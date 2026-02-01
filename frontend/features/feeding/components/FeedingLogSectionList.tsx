'use client';

import { FeedingLog } from '@/lib/types';
import { 
    Box, 
    Typography, 
    List,
    ListSubheader,
} from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';
import { useGroupedFeedingLogs } from '../hooks/useGroupedFeedingLogs';
import { useFeedingLogActions } from '../hooks/useFeedingLogActions';
import FeedingLogRow from './FeedingLogRow';
import FeedingLogDialog from './FeedingLogDialog';
import FeedingDetailSheet from './FeedingDetailSheet';
import ConfirmDeleteDialog from '@shared/components/ConfirmDeleteDialog';

interface FeedingLogSectionListProps {
    logs: FeedingLog[];
}

export default function FeedingLogSectionList({ logs }: FeedingLogSectionListProps) {
    const groupedLogs = useGroupedFeedingLogs(logs);
    const {
        selectedLog,
        isActionSheetOpen,
        isEditOpen,
        deletingId,
        handleItemClick,
        handleEditClick,
        handleDeleteClick,
        handleDeleteConfirm,
        closeActionSheet,
        closeEditDialog,
        closeDeleteDialog,
    } = useFeedingLogActions();

    const getHeaderText = (date: Date) => {
        const dateStr = format(date, 'd MMM').toUpperCase();
        if (isToday(date)) return `TODAY, ${dateStr}`;
        if (isYesterday(date)) return `YESTERDAY, ${dateStr}`;
        return format(date, 'EEE, d MMM').toUpperCase();
    };

    return (
        <Box sx={{ pb: 10, bgcolor: 'background.default' }}>
            {logs.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                    No feeding logs found.
                </Typography>
            ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
                    {groupedLogs.map((group) => (
                        <li key={group.dayKey}>
                            <ul style={{ padding: 0, listStyle: 'none' }}>
                                <ListSubheader 
                                    sx={{ 
                                        bgcolor: 'grey.200', 
                                        color: '#666', // Darker gray text
                                        fontWeight: 'bold', 
                                        fontSize: '0.85rem',
                                        textTransform: 'uppercase',
                                        lineHeight: '40px',
                                        height: '40px',
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        zIndex: 10,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        px: 2
                                    }}
                                >
                                    <span>{getHeaderText(group.date)}</span>
                                </ListSubheader>

                                {group.logs.map((log, index) => (
                                    <FeedingLogRow
                                        key={log.id}
                                        log={log}
                                        onClick={() => handleItemClick(log)}
                                        showDivider={index !== group.logs.length - 1}
                                    />
                                ))}
                            </ul>
                        </li>
                    ))}
                </List>
            )}

            <FeedingDetailSheet
                open={isActionSheetOpen}
                onClose={closeActionSheet}
                log={selectedLog}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {selectedLog && (
                <FeedingLogDialog
                    open={isEditOpen}
                    onClose={closeEditDialog}
                    initialData={selectedLog}
                />
            )}
            
            <ConfirmDeleteDialog
                open={!!deletingId}
                onClose={closeDeleteDialog}
                onConfirm={handleDeleteConfirm}
                title="Delete Record?"
                message="Are you sure you want to delete this feeding record?"
            />
        </Box>
    );
}
