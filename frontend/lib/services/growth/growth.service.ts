import type { IApiClient } from '@/lib/api-client.interface';
import { BaseService } from '../base.service';
import type { GrowthLog, CreateGrowthLogRequest, UpdateGrowthLogRequest } from '@/lib/types';

export class GrowthService extends BaseService {
  constructor(client: IApiClient) {
    super(client, 'GrowthLog');
  }

  getAll(): Promise<GrowthLog[]> {
    return this.api.get('/');
  }

  getById(id: string): Promise<GrowthLog> {
    return this.api.get(`/${id}`);
  }

  create(data: CreateGrowthLogRequest): Promise<GrowthLog> {
    return this.api.post('/', data);
  }

  update(id: string, data: UpdateGrowthLogRequest): Promise<GrowthLog> {
    return this.api.put(`/${id}`, data);
  }

  delete(id: string): Promise<void> {
    return this.api.delete(`/${id}`);
  }
}
