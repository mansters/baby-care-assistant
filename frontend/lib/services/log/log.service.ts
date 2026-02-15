import { BaseService } from '@/lib/services/base.service';
import type { IApiClient } from '@/lib/api-client.interface';
import type { PaginatedLogResponse, LogType } from '@/features/log/types';

export class LogService extends BaseService {
  constructor(client: IApiClient) {
    super(client, 'log');
  }

  getLogs(
    babyId: string,
    cursor?: string | null,
    pageSize: number = 20,
    types?: LogType[]
  ): Promise<PaginatedLogResponse> {
    const params = new URLSearchParams();
    params.set('babyId', babyId);
    params.set('pageSize', String(pageSize));

    if (cursor) {
      params.set('cursor', cursor);
    }

    if (types && types.length > 0) {
      types.forEach((t) => params.append('types', String(t)));
    }

    return this.api.get<PaginatedLogResponse>(`?${params.toString()}`);
  }
}
