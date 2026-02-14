'use client';

import { Divider, Typography } from '@mui/material';

export interface FormRowProps extends React.PropsWithChildren {
  label: string;
  sublabel?: string;
  required?: boolean;
  layout?: 'horizontal' | 'vertical';
  showDivider?: boolean;
}

export default function FormRow({
  label,
  sublabel,
  required = false,
  layout = 'horizontal',
  showDivider = true,
  children,
}: FormRowProps) {
  if (layout === 'vertical') {
    return (
      <div className="flex flex-col gap-3 py-4">

        <div className="flex flex-col items-start gap-[2px]">
          <Typography
            className="text-base font-normal leading-6"
            sx={{ color: '#101828' }}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </Typography>
          {sublabel && (
            <Typography
              className="text-xs font-normal leading-4"
              sx={{ color: '#99a1af', fontSize: '12px' }}
            >
              {sublabel}
            </Typography>
          )}
        </div>


        <div className="w-full">
          {children}
        </div>


        {showDivider && (
          <Divider sx={{ borderColor: '#e5e7eb', mt: 1 }} />
        )}
      </div>
    );
  }


  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between h-14">

        <div className="flex flex-col items-start gap-[2px]">
          <Typography
            className="text-base font-normal leading-6"
            sx={{ color: '#101828' }}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </Typography>
          {sublabel && (
            <Typography
              className="text-xs font-normal leading-4"
              sx={{ color: '#99a1af', fontSize: '12px' }}
            >
              {sublabel}
            </Typography>
          )}
        </div>


        <div className="flex items-center">
          {children}
        </div>
      </div>


      {showDivider && (
        <Divider sx={{ borderColor: '#e5e7eb' }} />
      )}
    </div>
  );
}
