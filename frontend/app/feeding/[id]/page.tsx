import React from 'react';
import { feedingService } from '@/lib/services/feeding/feeding.service.server';
import EditFeedingClient from './EditFeedingClient';

// Server Component
export default async function EditFeedingPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15+ params are async
    const { id } = await params;
    
    let feedingLog = null;
    try {
        feedingLog = await feedingService.getById(id);
    } catch (error) {
        console.error("Failed to fetch feeding log", error);
    }

    if (!feedingLog) {
        return <div>Feeding log not found.</div>;
    }

    return <EditFeedingClient initialData={feedingLog} />;
}
