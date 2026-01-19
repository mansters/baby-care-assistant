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
    type: string;
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