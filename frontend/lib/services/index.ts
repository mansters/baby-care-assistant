// Base service class
export { BaseService } from './base.service';

// Service classes (re-exported from subfolders)
export { FeedingService } from './feeding';
export { GrowthService } from './growth';

// Usage:
// Server: import { feedingService } from '@/lib/services/feeding/feeding.service.server'
// Client: import { feedingService } from '@/lib/services/feeding/feeding.service.client'
