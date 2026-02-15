'use client';

import { ReactNode } from 'react';
import { TbBabyBottle } from 'react-icons/tb';
import { FaPersonBreastfeeding } from 'react-icons/fa6';
import { ILogRendererStrategy, FeedingDetails } from '@/features/log/types';

export class FeedingLogRenderer implements ILogRendererStrategy {
  private details: FeedingDetails;

  constructor(details: FeedingDetails) {
    this.details = details;
  }

  getIcon(details: FeedingDetails): ReactNode {
    if (details.feedingType === 'Breast') {
      return <FaPersonBreastfeeding size={18} />;
    }

    return <TbBabyBottle size={18} />;
  }

  getFeatureKey(): string {
    return 'feeding';
  }

  renderContent(): string {
    const { feedingType, leftBreastDurationMinutes, rightBreastDurationMinutes, amountMl } = this.details;

    if (feedingType === 'Breast') {
      const parts: string[] = [];
      if (leftBreastDurationMinutes != null) parts.push(`L: ${leftBreastDurationMinutes}min`);
      if (rightBreastDurationMinutes != null) parts.push(`R: ${rightBreastDurationMinutes}min`);
      return parts.join(' | ');
    }

    if (feedingType === 'Bottle') {
      return `${amountMl}ml Formula`;
    }

    if (feedingType === 'Solids') {
      return `${amountMl}ml Solids`;
    }

    return `${amountMl}ml ${feedingType}`;
  }
}
