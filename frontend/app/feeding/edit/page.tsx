import React from "react";
import { feedingService } from "@/lib/services/feeding/feeding.service.server";
import EditFeedingClient from "./EditFeedingClient";

// Server Component
export default async function EditFeedingPage({
  searchParams,
}: {
  searchParams: Promise<{ babyId: string; sk: string }>;
}) {
  // Next.js 15+ searchParams are async
  const { babyId, sk } = await searchParams;

  let feedingLog = null;
  try {
    feedingLog = await feedingService.getById(babyId, sk);
  } catch (error) {
    console.error("Failed to fetch feeding log", error);
  }

  if (!feedingLog) {
    return <div>Feeding log not found.</div>;
  }

  return <EditFeedingClient initialData={feedingLog} />;
}
