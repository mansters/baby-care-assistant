import type { IApiClient } from '@/lib/api-client.interface';
import { BaseService } from '../base.service';
import type { FeedingLog, CreateFeedingLogRequest, UpdateFeedingLogRequest } from '@/lib/types';

export class FeedingService extends BaseService {
  constructor(client: IApiClient) {
    super(client, 'feeding');
  }

  getAll(): Promise<FeedingLog[]> {
    return this.api.get('/');
  }

  getById(id: string): Promise<FeedingLog> {
    return this.api.get(`/${id}`);
  }

  create(data: CreateFeedingLogRequest): Promise<FeedingLog> {
    return this.api.post('/', data);
  }

  update(id: string, data: UpdateFeedingLogRequest): Promise<FeedingLog> {
    return this.api.put(`/${id}`, data);
  }

  delete(id: string): Promise<void> {
    return this.api.delete(`/${id}`);
  }

  getDailyFeedingSummary(babyId: string, timeZoneId: string = 'Asia/Shanghai'): Promise<DailyFeedingSummaryDto> {
    return this.api.get(`/daily-summary?babyId=${babyId}&timeZoneId=${encodeURIComponent(timeZoneId)}`);
  }
}

export interface DailyFeedingInfo {
  totalMl: number;
  feedCount: number;
}

export interface DailyFeedingSummaryDto {
  dailyTotals: Record<string, DailyFeedingInfo>;
}
