import { ReactNode } from 'react';

export enum LogType {
  Feeding = "Feeding",
  Sleep = "Sleep",
  Diaper = "Diaper",
  Growth = "Growth",
}

export interface BaseLogDetails {
  babyId: string;
  sk: string;
  eventTimeUtc: string;
  localDate: string;
  localTime: string;
}

export interface FeedingDetails extends BaseLogDetails {
  type: string;
  leftBreastDurationMinutes?: number;
  rightBreastDurationMinutes?: number;
  amountMl: number;
}

export interface GrowthDetails extends BaseLogDetails {
  weightKg: number;
  heightCm?: number;
  headCircumferenceCm?: number;
}

export type LogDetails = FeedingDetails | GrowthDetails;

export interface LogEntry {
  id: string;
  startTime: string;
  type: LogType;
  note?: string;
  details: LogDetails;
}

export interface PaginatedLogResponse {
  items: LogEntry[];
  nextCursor: string | null;
}

export interface ILogRendererStrategy {
  getIcon(details: LogDetails): ReactNode;
  getFeatureKey(): string;
  renderContent(details: LogDetails): string;
}

export interface ILogDrawerStrategy {
  getDrawerIcon(details: LogDetails): ReactNode;
  getPrimaryInfo(details: LogDetails): string;
  getSecondaryInfo(details: LogDetails): string;
  getFeatureKey(): string;
  getUpdatePath(babyId: string, sk: string): string;
  deleteEntry(babyId: string, sk: string): Promise<void>;
}
