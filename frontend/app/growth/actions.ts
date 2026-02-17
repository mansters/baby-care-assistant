'use server';

import { redirect } from 'next/navigation';
import { growthService } from '@/lib/services/growth/growth.service.server';
import { CreateGrowthLogRequest, UpdateGrowthLogRequest } from '@/lib/types';
import { GrowthFormValues } from '@/lib/schemas/growth.schema';
import { buildRedirectUrl } from '@/lib/utils/redirect';

export async function createGrowthLog(data: GrowthFormValues, babyId: string, redirectTo = '/home') {
    const request: CreateGrowthLogRequest = {
        babyId,
        dateMeasured: new Date(data.startTime).toISOString(),
        weightKg: data.weightKg,
        heightCm: data.heightCm ?? undefined,
        headCircumferenceCm: data.headCircumferenceCm ?? undefined,
        note: data.note || undefined,
    };

    await growthService.create(request);
    redirect(buildRedirectUrl(redirectTo, { type: 'success', message: 'Growth log saved successfully' }));
}

export async function updateGrowthLog(id: string, data: GrowthFormValues, babyId: string, redirectTo = '/home') {
    const request: UpdateGrowthLogRequest = {
        id,
        babyId,
        dateMeasured: new Date(data.startTime).toISOString(),
        weightKg: data.weightKg,
        heightCm: data.heightCm ?? undefined,
        headCircumferenceCm: data.headCircumferenceCm ?? undefined,
        note: data.note || undefined,
    };

    await growthService.update(id, request);
    redirect(buildRedirectUrl(redirectTo, { type: 'success', message: 'Growth log updated successfully' }));
}

export async function deleteGrowthLog(id: string) {
    await growthService.delete(id);
}
