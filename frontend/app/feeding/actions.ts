'use server';

import { redirect } from 'next/navigation';
import { feedingService } from '@/lib/services/feeding/feeding.service.server';
import { CreateFeedingLogRequest, UpdateFeedingLogRequest, FeedingType } from '@/lib/types';
import { FeedingFormValues } from '@/lib/schemas/feeding.schema';

export async function createFeedingLog(data: FeedingFormValues, babyId: string) {
    // Backend requires DurationMinutes > 0.
    // We default to 1 minute if calculation yields 0 (e.g. for Bottle or if duration omitted)
    const request: CreateFeedingLogRequest = {
        babyId,
        feedingTime: new Date(data.startTime).toISOString(),
        type: data.type === 'Nursing' ? FeedingType.Breast : FeedingType.Bottle,
        amountMl: data.amountMl || 0,
        leftBreastDurationMinutes: data.leftDuration || 0,
        rightBreastDurationMinutes: data.rightDuration || 0,
        note: data.note || undefined
    };

    console.log("Creating feeding log:", JSON.stringify(request));

    await feedingService.create(request);
    redirect('/home?feeding_created=true');
}

export async function updateFeedingLog(id: string, data: FeedingFormValues, babyId: string) {
    const request: UpdateFeedingLogRequest = {
        id,
        babyId,
        feedingTime: new Date(data.startTime).toISOString(),
        type: data.type === 'Nursing' ? FeedingType.Breast : FeedingType.Bottle,
        amountMl: data.amountMl || 0,
        leftBreastDurationMinutes: data.leftDuration || 0,
        rightBreastDurationMinutes: data.rightDuration || 0,
        note: data.note || undefined
    };

    console.log("Updating feeding log:", JSON.stringify(request));

    await feedingService.update(id, request);
    redirect('/home?feeding_updated=true');
}

export async function deleteFeedingLog(id: string) {
    await feedingService.delete(id);
}
