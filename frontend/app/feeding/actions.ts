'use server';

import { redirect } from 'next/navigation';
import { feedingService } from '@/lib/services/feeding/feeding.service.server';
import { CreateFeedingLogRequest, UpdateFeedingLogRequest, FeedingType } from '@/lib/types';
import { FeedingFormValues } from '@/lib/schemas/feeding.schema';
import { buildRedirectUrl } from '@/lib/utils/redirect';
import { toUtcIsoString } from '@/lib/utils/datetime';

export async function createFeedingLog(data: FeedingFormValues, babyId: string, redirectTo = '/home') {
    const request: CreateFeedingLogRequest = {
        babyId,
        localDateTime: toUtcIsoString(new Date(data.startTime)),
        type: data.type === 'Nursing' ? FeedingType.Breast : FeedingType.Bottle,
        amountMl: data.amountMl || 0,
        leftBreastDurationMinutes: data.leftDuration || 0,
        rightBreastDurationMinutes: data.rightDuration || 0,
        note: data.note || undefined
    };

    console.log("Creating feeding log:", JSON.stringify(request));

    await feedingService.create(request);
    redirect(buildRedirectUrl(redirectTo, { type: 'success', message: 'Feeding log saved successfully' }));
}

export async function updateFeedingLog(sk: string, data: FeedingFormValues, babyId: string, redirectTo = '/home') {
    const request: UpdateFeedingLogRequest = {
        sk,
        babyId,
        localDateTime: toUtcIsoString(new Date(data.startTime)),
        type: data.type === 'Nursing' ? FeedingType.Breast : FeedingType.Bottle,
        amountMl: data.amountMl || 0,
        leftBreastDurationMinutes: data.leftDuration || 0,
        rightBreastDurationMinutes: data.rightDuration || 0,
        note: data.note || undefined
    };

    console.log("Updating feeding log:", JSON.stringify(request));
    await feedingService.update(babyId, sk, request);
    redirect(buildRedirectUrl(redirectTo, { type: 'success', message: 'Feeding log updated successfully' }));
}
export async function deleteFeedingLog(babyId: string, sk: string) {
    await feedingService.delete(babyId, sk);
}

