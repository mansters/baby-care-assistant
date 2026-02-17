import { ReactNode } from 'react';

export enum LogType {
  Feeding = "Feeding",
  Sleep = "Sleep",
  Diaper = "Diaper",
  Growth = "Growth",
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

export interface ILogDrawerStrategy {
  getDrawerIcon(details: FeedingDetails): ReactNode;
  getPrimaryInfo(details: FeedingDetails): string;
  getSecondaryInfo(details: FeedingDetails): string;
  getFeatureKey(): string;
  getUpdatePath(id: string): string;
  deleteEntry(id: string): Promise<void>;
}
