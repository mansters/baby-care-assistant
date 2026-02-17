'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface DeleteConfirmDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { sx: { borderRadius: '16px', px: 1, py: 0.5 } },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '18px', color: '#101828' }}>
        Delete Log Entry
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#4a5565', fontSize: '14px' }}>
          Are you sure you want to delete this log entry? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#6a7282',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            backgroundColor: '#fb2c36',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            borderRadius: '10px',
            px: 3,
            '&:hover': { backgroundColor: '#e0242e' },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
