import { serverApiClient } from '@/lib/api-client.server';
import { GrowthService } from './growth.service';

export const growthService = new GrowthService(serverApiClient);
