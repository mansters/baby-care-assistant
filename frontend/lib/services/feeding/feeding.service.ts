import type { IApiClient } from '@/lib/api-client.interface';
import { BaseService } from '../base.service';
import type { FeedingLog, CreateFeedingLogRequest, UpdateFeedingLogRequest } from '@/lib/types';

export class FeedingService extends BaseService {
  constructor(client: IApiClient) {
    super(client, 'feeding');
  }

  getAll(babyId: string, cursorSk?: string, limit: number = 20): Promise<FeedingLog[]> {
    const cursorParam = cursorSk ? `&cursorSk=${encodeURIComponent(cursorSk)}` : '';
    return this.api.get(`/?babyId=${babyId}${cursorParam}&limit=${limit}`);
  }

  getById(babyId: string, sk: string): Promise<FeedingLog> {
    return this.api.get(`/item?babyId=${babyId}&sk=${encodeURIComponent(sk)}`);
  }

  create(data: CreateFeedingLogRequest): Promise<FeedingLog> {
    return this.api.post('/', data);
  }

  update(babyId: string, sk: string, data: UpdateFeedingLogRequest): Promise<FeedingLog> {
    return this.api.put(`/item?babyId=${babyId}&sk=${encodeURIComponent(sk)}`, data);
  }

  delete(babyId: string, sk: string): Promise<void> {
    return this.api.delete(`/item?babyId=${babyId}&sk=${encodeURIComponent(sk)}`);
  }

  getDailyFeedingSummary(babyId: string, timeZoneId: string = 'Asia/Shanghai'): Promise<DailyFeedingSummaryDto> {
    return this.api.get(`/daily-summary?babyId=${babyId}&timeZoneId=${encodeURIComponent(timeZoneId)}`);
  }

  getNextFeeding(babyId: string): Promise<NextFeedingDto> {
    return this.api.get(`/next-feeding?babyId=${babyId}`);
  }
}

export interface DailyFeedingInfo {
  totalMl: number;
  feedCount: number;
}

export interface DailyFeedingSummaryDto {
  dailyTotals: Record<string, DailyFeedingInfo>;
}

export interface NextFeedingDto {
  lastFeedingTime: string | null;
  nextFeedingTime: string | null;
  predictedAmountMl: number | null;
}
