export enum FeedingType {
    Bottle,
    Breast,
    Solids
}

export interface FeedingLog {
    id: string;
    babyId: string;
    feedingTime: string;    
    durationMinutes: number;
    type: FeedingType;
    amountMl: number;
}

export interface CreateFeedingLogRequest {
    babyId: string; 
    feedingTime: string;
    durationMinutes: number;
    type: FeedingType;
    amountMl: number;
    notes?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5280';

export async function getFeedingLogs(): Promise<FeedingLog[]> {
    const res = await fetch(`${API_BASE_URL}/api/feeding`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
}

export async function createFeedingLog(log: CreateFeedingLogRequest): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/feeding`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
    });

    if (!res.ok) {
        throw new Error('Failed to create feeding log');
    }
}

export interface GrowthLog {
    id: string;
    babyId: string;
    dateMeasured: string;
    weightKg: number;
    heightCm?: number;
    headCircumferenceCm?: number;
    note?: string;
}

export interface CreateGrowthLogRequest {
    babyId: string;
    dateMeasured: string;
    weightKg: number;
    heightCm?: number;
    headCircumferenceCm?: number;
    note?: string;
}

export async function getGrowthLogs(): Promise<GrowthLog[]> {
    const res = await fetch(`${API_BASE_URL}/api/GrowthLog`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch growth logs');
    return res.json();
}

export async function createGrowthLog(log: CreateGrowthLogRequest): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/GrowthLog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
    });

    if (!res.ok) {
        throw new Error('Failed to create growth log');
    }
}

export interface UpdateGrowthLogRequest extends CreateGrowthLogRequest {
    id: string;
}

export async function updateGrowthLog(id: string, log: UpdateGrowthLogRequest): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/GrowthLog/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
    });

    if (!res.ok) {
        throw new Error('Failed to update growth log');
    }
}

export async function deleteGrowthLog(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/GrowthLog/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Failed to delete growth log');
    }
}