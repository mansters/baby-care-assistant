import { ReactNode } from 'react';

export enum LogType {
  Feeding = 0,
  Sleep = 1,
  Diaper = 2,
  Growth = 3,
}

export interface FeedingDetails {
  feedingType: string;
  leftBreastDurationMinutes?: number;
  rightBreastDurationMinutes?: number;
  amountMl: number;
}

export interface LogEntry {
  id: string;
  startTime: string;
  type: LogType;
  note?: string;
  details: FeedingDetails;
}

export interface PaginatedLogResponse {
  items: LogEntry[];
  nextCursor: string | null;
}

export interface ILogRendererStrategy {
  getIcon(details: FeedingDetails): ReactNode;
  getFeatureKey(): string;
  renderContent(details: FeedingDetails): string;
}
