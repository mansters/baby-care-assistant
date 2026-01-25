'use client';

import { useState, useMemo } from 'react';
import { GrowthLog, deleteGrowthLog } from '@/lib/api-client';
import { formatLocal } from '@/lib/date-utils';
import { 
    Box, 
    Typography, 
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Drawer,
    ListItemIcon,
    ListItemButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GrowthLogDialog from './GrowthLogDialog';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface GrowthLogSectionListProps {
    logs: GrowthLog[];
}

export default function GrowthLogSectionList({ logs }: GrowthLogSectionListProps) {
    const router = useRouter();
    const [selectedLog, setSelectedLog] = useState<GrowthLog | null>(null);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleItemClick = (log: GrowthLog) => {
        setSelectedLog(log);
        setIsActionSheetOpen(true);
    };

    const handleEditClick = () => {
        setIsActionSheetOpen(false);
        setIsEditOpen(true);
    };

    const handleDeleteClick = () => {
        setIsActionSheetOpen(false);
        if (selectedLog) {
            setDeletingId(selectedLog.id);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;
        try {
            await deleteGrowthLog(deletingId);
            setDeletingId(null);
            setSelectedLog(null);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete log', error);
            alert('Failed to delete log');
        }
    };

    // Group logs by month
    const groupedLogs = useMemo(() => {
        const groups: { monthKey: string; date: Date; logs: GrowthLog[]; weightChange: number | null }[] = [];
        
        // Sort logs by date descending first
        const sortedLogs = [...logs].sort((a, b) => new Date(b.dateMeasured).getTime() - new Date(a.dateMeasured).getTime());

        sortedLogs.forEach(log => {
            const date = new Date(log.dateMeasured);
            const monthKey = format(date, 'yyyy-MM');
            
            const existingGroup = groups.find(g => g.monthKey === monthKey);
            if (existingGroup) {
                existingGroup.logs.push(log);
            } else {
                groups.push({ monthKey, date, logs: [log], weightChange: null });
            }
        });

        // Calculate summaries
        for (let i = 0; i < groups.length; i++) {
            const currentGroup = groups[i];
            const previousGroup = groups[i + 1];

            if (previousGroup) {
                const currentMonthLatestWeight = currentGroup.logs[0].weightKg;
                const previousMonthLatestWeight = previousGroup.logs[0].weightKg;
                currentGroup.weightChange = currentMonthLatestWeight - previousMonthLatestWeight;
            }
        }

        return groups;
    }, [logs]);

    const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };

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
                                        height: '40px', // Standardize height
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

                                {group.logs.map((log, index) => {
                                    const date = new Date(log.dateMeasured);
                                    const dayNum = date.getDate();
                                    const suffix = getOrdinalSuffix(dayNum);
                                    const isLast = index === group.logs.length - 1;
                                    
                                    return (
                                        <Box key={log.id} component="li">
                                            <ListItemButton 
                                                onClick={() => handleItemClick(log)}
                                                sx={{ 
                                                    p: 0, 
                                                }}
                                            >
                                                <Box sx={{ 
                                                    p: 2,
                                                    width: '100%',
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
                                            </ListItemButton>
                                            {!isLast && <Divider variant="inset" component="li" />}
                                        </Box>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </List>
            )}

            {/* Bottom Sheet Actions */}
            <Drawer
                anchor="bottom"
                open={isActionSheetOpen}
                onClose={() => setIsActionSheetOpen(false)}
                PaperProps={{
                    sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 2 }
                }}
            >
                <Box sx={{ pt: 2, pb: 1, px: 2 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Manage Record
                    </Typography>
                    {selectedLog && (
                         <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                            {formatLocal(selectedLog.dateMeasured, 'MMMM d, h:mm a')}
                        </Typography>
                    )}
                </Box>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleEditClick}>
                            <ListItemIcon>
                                <EditIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Edit Record" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleDeleteClick}>
                            <ListItemIcon>
                                <DeleteIcon color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Delete Record" primaryTypographyProps={{ color: 'error' }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Box sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" onClick={() => setIsActionSheetOpen(false)}>
                        Cancel
                    </Button>
                </Box>
            </Drawer>

            {/* Edit Dialog */}
            {selectedLog && (
                <GrowthLogDialog
                    open={isEditOpen}
                    onClose={() => {
                        setIsEditOpen(false);
                        setSelectedLog(null);
                    }}
                    initialData={selectedLog}
                />
            )}

            {/* Delete Confirmation */}
            <Dialog
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
            >
                <DialogTitle>Delete Record?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this growth record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletingId(null)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
