import { serverApiClient } from '@/lib/api-client.server';
import { UserService } from './user.service';

export const userService = new UserService(serverApiClient);
