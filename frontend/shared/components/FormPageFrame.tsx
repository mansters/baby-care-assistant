'use client';

import { Box, Button, CircularProgress } from '@mui/material';
import { IoArrowBack } from 'react-icons/io5';

export interface FormPageFrameProps extends React.PropsWithChildren {
  title: string;
  themeColor: string;
  onBack?: () => void;
  onSave?: () => void;
  saveLabel?: string;
  isSaving?: boolean;
}

export default function FormPageFrame({
  title,
  themeColor,
  onBack,
  onSave,
  saveLabel = 'Save',
  isSaving = false,
  children,
}: FormPageFrameProps) {
  return (
    <div className="flex flex-col h-screen w-full">

      <Box
        component="header"
        className="flex items-center gap-4 h-16 min-h-16 pl-6 shrink-0"
        sx={{ bgcolor: themeColor }}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 p-1 bg-transparent border-none cursor-pointer text-white"
            aria-label="Go back"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
        )}
        <span className="text-[20px] font-semibold text-white tracking-[-0.45px] leading-7">
          {title}
        </span>
      </Box>


      <div className="flex-1 overflow-y-auto bg-white">
        {children}
      </div>


      {onSave && (
        <div className="shrink-0 pt-[25px] px-6 pb-6 bg-white border-t border-[var(--gray-border)]">
          <Button
            onClick={onSave}
            disabled={isSaving}
            fullWidth
            sx={{
              height: 60,
              borderRadius: 9999,
              bgcolor: themeColor,
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: themeColor,
                opacity: 0.9,
              },
              '&:disabled': {
                bgcolor: themeColor,
                opacity: 0.6,
                color: 'white',
              },
            }}
          >
            {isSaving ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              saveLabel
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
