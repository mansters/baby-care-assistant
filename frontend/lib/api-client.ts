// frontend/lib/api-client.ts

export interface FeedingLog {
    id: string;
    babyId: string;
    feedingTime: string;    // DateTime becomes string in JSON
    durationMinutes: number;
    type: string;
    amountMl: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5280';

export async function getFeedingLogs(): Promise<FeedingLog[]> {
    // ... (Fetch logic remains the same)
    const res = await fetch(`${API_BASE_URL}/api/feeding`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
}