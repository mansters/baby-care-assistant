import React from 'react';
import { feedingService } from '@/lib/services/feeding/feeding.service.server';
import CreateFeedingClient from './CreateFeedingClient';

// Ensure this component is treated as a Server Component
// by NOT including 'use client' at the top.

export default async function FeedingPage() {
    // In a real app, we might fetch the baby ID from the session or a service.
    // Here we'll replicate the existing logic of fetching the first baby.
    // Since we are on the server, we can use the service directly if it supports it,
    // or fetch from the API.
    // The previous logic fetched from http://localhost:5280/api/Baby
    
    // We don't have a BabyService wrapper handy, so let's do a direct fetch 
    // or assume we can get it.
    // Ideally, we'd have: const babies = await babyService.getAll();
    // For now, let's fetch directly.
    
    let babyId = '';
    try {
        const res = await fetch('http://localhost:5280/api/Baby', { cache: 'no-store' });
        const babies = await res.json();
        if (babies && babies.length > 0) {
            babyId = babies[0].id;
        }
    } catch (e) {
        console.error("Failed to fetch babies", e);
    }
    
    if (!babyId) {
        return <div>Error: No baby found. Please create a baby profile first.</div>;
    }

    return <CreateFeedingClient babyId={babyId} />;
}