'use client';

import { ReactNode } from 'react';

interface LogGroupProps {
  dateLabel: string;
  children: ReactNode;
}

export default function LogGroup({ dateLabel, children }: LogGroupProps) {
  return (
    <div className="mb-2">
      <div className="sticky top-0 z-10 bg-[#f9fafb] py-2 px-4">
        <span className="text-xs font-bold tracking-wider text-[#99a1af] uppercase">
          {dateLabel}
        </span>
      </div>
      <div className="flex flex-col gap-1 px-4">
        {children}
      </div>
    </div>
  );
}
