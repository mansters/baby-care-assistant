'use client';

import React, { ReactNode } from 'react';
import { Divider, Typography, FormHelperText } from '@mui/material';
import cls from 'classnames';

export interface FormRowProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  layout?: 'horizontal' | 'vertical';
  showDivider?: boolean;
  htmlFor?: string;
  error?: boolean;
  helperText?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export default function FormRow({
  label,
  sublabel,
  required = false,
  layout = 'horizontal',
  showDivider = true,
  htmlFor,
  error = false,
  helperText,
  footer,
  children,
}: FormRowProps) {

  // 定义 Label 颜色：报错显示红色，否则显示默认黑
  const labelColor = error ? 'error.main' : '#101828';

  return (
    <div className="flex flex-col w-full">
      <div className={cls(
        "flex min-h-[56px] py-2",
        layout === 'horizontal' ? "items-center justify-between" : "flex-col items-start gap-2"
      )}>
        
        <div className="flex flex-col items-start gap-[2px] pr-4">
          <Typography
            component="label"
            htmlFor={htmlFor}
            className="text-base font-normal leading-6 cursor-pointer"
            sx={{ color: labelColor }}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </Typography>
          {sublabel && (
            <Typography
              className="text-xs"
              sx={{ color: error ? 'error.main' : '#99a1af' }}
            >
              {sublabel}
            </Typography>
          )}
        </div>

        <div className={cls(
          "flex items-center justify-end",
          layout === 'horizontal' ? "flex-1 text-right" : "w-full"
        )}>
          {children}
        </div>
      </div>

      {footer && (
        <div className="w-full pb-2 mt-[-8px]">
          {footer}
        </div>
      )}

      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0, mb: 1, textAlign: 'right' }}>
          {helperText}
        </FormHelperText>
      )}

      {showDivider && (
        <Divider sx={{ borderColor: '#e5e7eb' }} />
      )}
    </div>
  );
}