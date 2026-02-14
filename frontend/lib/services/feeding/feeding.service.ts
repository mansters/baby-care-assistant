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
    // Enforce backend validation rule: DurationMinutes must be between 1 and 1000
    if ((data.durationMinutes || 0) <= 0) {
        data.durationMinutes = 1;
    }
    return this.api.post('/', data);
  }

  update(id: string, data: UpdateFeedingLogRequest): Promise<FeedingLog> {
    // Enforce backend validation rule: DurationMinutes must be between 1 and 1000
    if ((data.durationMinutes || 0) <= 0) {
        data.durationMinutes = 1;
    }
    return this.api.put(`/${id}`, data);
  }

  delete(id: string): Promise<void> {
    return this.api.delete(`/${id}`);
  }
}
