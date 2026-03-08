import { BaseService } from '@/lib/services/base.service';
import type { IApiClient } from '@/lib/api-client.interface';
import type { PaginatedLogResponse, LogType } from '@/features/log/types';

export class LogService extends BaseService {
  constructor(client: IApiClient) {
    super(client, 'log');
  }

  getLogs(
    babyId: string,
    cursorSk?: string | null,
    pageSize: number = 20,
    types?: LogType[]
  ): Promise<PaginatedLogResponse> {
    const params = new URLSearchParams();
    params.set('babyId', babyId);
    params.set('limit', String(pageSize));

    if (cursorSk) {
      params.set('cursorSk', cursorSk);
    }

    if (types && types.length > 0) {
      types.forEach((t) => params.append('types', String(t)));
    }

    return this.api.get<PaginatedLogResponse>(`?${params.toString()}`);
  }
}
