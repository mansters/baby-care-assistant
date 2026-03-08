'use server';

import { feedingService } from '@/lib/services/feeding/feeding.service.server';
import { LogService } from '@/lib/services/log/log.service';
import { serverApiClient } from '@/lib/api-client.server';
import type { PaginatedLogResponse, LogType } from '@/features/log/types';
import type { DailyFeedingSummaryDto } from '@/lib/services/feeding/feeding.service';

const logService = new LogService(serverApiClient);

export async function fetchLogs(
  babyId: string,
  cursorSk: string | null,
  pageSize: number,
  types?: LogType[]
): Promise<PaginatedLogResponse> {
  return logService.getLogs(babyId, cursorSk, pageSize, types);
}

export async function fetchDailyFeedingSummary(
  babyId: string,
  timeZoneId: string
): Promise<DailyFeedingSummaryDto> {
  return feedingService.getDailyFeedingSummary(babyId, timeZoneId);
}
