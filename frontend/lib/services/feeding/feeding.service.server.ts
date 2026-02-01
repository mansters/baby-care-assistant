import { serverApiClient } from '@/lib/api-client.server';
import { FeedingService } from './feeding.service';

export const feedingService = new FeedingService(serverApiClient);
