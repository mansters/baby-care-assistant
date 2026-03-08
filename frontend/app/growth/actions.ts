'use server';

import { redirect } from 'next/navigation';
import { growthService } from '@/lib/services/growth/growth.service.server';
import { CreateGrowthLogRequest, UpdateGrowthLogRequest } from '@/lib/types';
import { GrowthFormValues } from '@/lib/schemas/growth.schema';
import { buildRedirectUrl } from '@/lib/utils/redirect';
import { toUtcIsoString } from '@/lib/utils/datetime';

export async function createGrowthLog(data: GrowthFormValues, babyId: string, redirectTo = '/home') {
    const request: CreateGrowthLogRequest = {
        babyId,
        eventTimeUtc: toUtcIsoString(new Date(data.startTime)),
        weightKg: data.weightKg,
        heightCm: data.heightCm ?? undefined,
        headCircumferenceCm: data.headCircumferenceCm ?? undefined,
        note: data.note || undefined,
    };

    await growthService.create(request);
    redirect(buildRedirectUrl(redirectTo, { type: 'success', message: 'Growth log saved successfully' }));
}

export async function updateGrowthLog(sk: string, data: GrowthFormValues, babyId: string, redirectTo = '/home') {
    const request: UpdateGrowthLogRequest = {
        sk,
        babyId,
        eventTimeUtc: toUtcIsoString(new Date(data.startTime)),
        weightKg: data.weightKg,
        heightCm: data.heightCm ?? undefined,
        headCircumferenceCm: data.headCircumferenceCm ?? undefined,
        note: data.note || undefined,
    };
    await growthService.update(babyId, sk, request);
    redirect(buildRedirectUrl(redirectTo, { type: 'success', message: 'Growth log updated successfully' }));
}
export async function deleteGrowthLog(babyId: string, sk: string) {
    await growthService.delete(babyId, sk);
}

