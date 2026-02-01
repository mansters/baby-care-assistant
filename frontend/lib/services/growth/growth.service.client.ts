import { apiClient } from '@/lib/api-client';
import { GrowthService } from './growth.service';

export const growthService = new GrowthService(apiClient);
