import { apiClient } from '@/lib/api-client';
import { FeedingService } from './feeding.service';

// Ensure singleton instance
export const feedingService = new FeedingService(apiClient);
