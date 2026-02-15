'use client';

import { LogEntry } from '@/features/log/types';
import { getRenderer } from '@/features/log/strategies/registry';
import { FeatureTheme } from '@/lib/theme/feature-theme';
import { format } from 'date-fns';

interface LogItemProps {
  entry: LogEntry;
}

export default function LogItem({ entry }: LogItemProps) {
  const renderer = getRenderer(entry.type, entry.details);
  const featureKey = renderer.getFeatureKey();
  const theme = FeatureTheme[featureKey as keyof typeof FeatureTheme];
  const content = renderer.renderContent(entry.details);
  const icon = renderer.getIcon(entry.details);
  const time = format(new Date(entry.startTime), 'HH:mm');

  return (
    <div className="flex items-start gap-3 py-1">

      <div className="w-14 flex-shrink-0 pt-2">
        <span className="text-base font-bold text-[#364153]">{time}</span>
      </div>


      <div
        className="flex-1 rounded-[14px] p-3"
        style={{ backgroundColor: theme?.surfaceLight || '#f3f4f6' }}
      >
        <div className="flex items-center gap-3">

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: theme?.primary || '#6b7280',
              color: '#ffffff',
            }}
          >
            {icon}
          </div>


          <span className="text-base font-bold text-[#364153]">{content}</span>
        </div>


        {entry.note && (
          <p className="text-sm text-[#6a7282] mt-1 ml-12">{entry.note}</p>
        )}
      </div>
    </div>
  );
}
