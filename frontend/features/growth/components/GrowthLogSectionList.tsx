'use client';

import { GrowthLog } from '@/lib/api-client';
import { 
    Box, 
    Typography, 
    List,
    ListSubheader,
} from '@mui/material';
import { format } from 'date-fns';
import { useGroupedLogs } from '../hooks/useGroupedLogs';
import { useGrowthLogActions } from '../hooks/useGrowthLogActions';
import GrowthLogRow from './GrowthLogRow';
import GrowthLogDialog from './GrowthLogDialog';

import GrowthDetailSheet from './GrowthDetailSheet';
import ConfirmDeleteDialog from '@shared/components/ConfirmDeleteDialog';

interface GrowthLogSectionListProps {
    logs: GrowthLog[];
}

export default function GrowthLogSectionList({ logs }: GrowthLogSectionListProps) {
    const groupedLogs = useGroupedLogs(logs);
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
    } = useGrowthLogActions();

    return (
        <Box sx={{ pb: 10, bgcolor: 'background.default' }}>
            {logs.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                    No growth logs found.
                </Typography>
            ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
                    {groupedLogs.map((group) => (
                        <li key={group.monthKey}>
                            <ul style={{ padding: 0, listStyle: 'none' }}>
                                <ListSubheader 
                                    sx={{ 
                                        bgcolor: 'grey.200', 
                                        color: 'text.secondary',
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
                                    <span>{format(group.date, 'MMMM yyyy')}</span>
                                    {group.weightChange !== null && typeof group.weightChange === 'number' && (
                                        <Typography 
                                            component="span" 
                                            variant="caption" 
                                            fontWeight="bold"
                                            sx={{ color: group.weightChange > 0 ? "success.main" : "text.secondary" }}
                                        >
                                            {group.weightChange > 0 ? '+' : ''}{group.weightChange.toFixed(2)} kg
                                        </Typography>
                                    )}
                                </ListSubheader>

                                {group.logs.map((log, index) => (
                                    <GrowthLogRow
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

            <GrowthDetailSheet
                open={isActionSheetOpen}
                onClose={closeActionSheet}
                log={selectedLog}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {selectedLog && (
                <GrowthLogDialog
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
                message="Are you sure you want to delete this growth record?"
            />
        </Box>
    );
}
