import type { IApiClient } from '@/lib/api-client.interface';
import { BaseService } from '../base.service';
import type { GrowthLog, CreateGrowthLogRequest, UpdateGrowthLogRequest } from '@/lib/types';

export class GrowthService extends BaseService {
  constructor(client: IApiClient) {
    super(client, 'GrowthLog');
  }

  getAll(babyId: string, cursorSk?: string, limit: number = 20): Promise<GrowthLog[]> {
    const cursorParam = cursorSk ? `&cursorSk=${encodeURIComponent(cursorSk)}` : '';
    return this.api.get(`/?babyId=${babyId}${cursorParam}&limit=${limit}`);
  }

  getById(babyId: string, sk: string): Promise<GrowthLog> {
    return this.api.get(`/item?babyId=${babyId}&sk=${encodeURIComponent(sk)}`);
  }

  create(data: CreateGrowthLogRequest): Promise<GrowthLog> {
    return this.api.post('/', data);
  }

  update(babyId: string, sk: string, data: UpdateGrowthLogRequest): Promise<GrowthLog> {
    return this.api.put(`/item?babyId=${babyId}&sk=${encodeURIComponent(sk)}`, data);
  }

  delete(babyId: string, sk: string): Promise<void> {
    return this.api.delete(`/item?babyId=${babyId}&sk=${encodeURIComponent(sk)}`);
  }
}
