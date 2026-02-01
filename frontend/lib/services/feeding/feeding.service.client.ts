import { apiClient } from '@/lib/api-client';
import { FeedingService } from './feeding.service';

export const feedingService = new FeedingService(apiClient);
