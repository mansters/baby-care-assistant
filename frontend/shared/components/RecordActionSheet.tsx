'use client';

import { 
    Drawer, 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Button 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecordActionSheetProps {
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    recordDate?: string;
}

/**
 * Reusable bottom sheet for Edit/Delete actions on a record.
 */
export default function RecordActionSheet({ 
    open, 
    onClose, 
    onEdit, 
    onDelete, 
    recordDate 
}: RecordActionSheetProps) {
    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 2 }
            }}
        >
            <Box sx={{ pt: 2, pb: 1, px: 2 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Manage Record
                </Typography>
                {recordDate && (
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                        {recordDate}
                    </Typography>
                )}
            </Box>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={onEdit}>
                        <ListItemIcon>
                            <EditIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Edit Record" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={onDelete}>
                        <ListItemIcon>
                            <DeleteIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Delete Record" primaryTypographyProps={{ color: 'error' }} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Box sx={{ p: 2 }}>
                <Button fullWidth variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
            </Box>
        </Drawer>
    );
}
