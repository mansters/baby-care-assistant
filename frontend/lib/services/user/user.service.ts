import { BaseService } from '../base.service';
import type { IApiClient } from '@/lib/api-client.interface';
import type { UserContextDto } from './user-context.types';

export class UserService extends BaseService {
  constructor(client: IApiClient) {
    super(client, 'users');
  }

  async getMyContext(): Promise<UserContextDto> {
    return this.api.get<UserContextDto>('/me/context');
  }
}
