import React from "react";
import CreateFeedingClient from "./CreateFeedingClient";
import { userService } from "@/lib/services/user/user.service.server";

// Ensure this component is treated as a Server Component
// by NOT including 'use client' at the top.

export default async function FeedingPage() {
  const userContext = await userService.getMyContext();
  const firstFamily = userContext.families?.[0];
  const firstBaby = firstFamily?.babies?.[0];
  const babyId = firstBaby?.id;

  if (!babyId) {
    return <div>Error: No baby found. Please create a baby profile first.</div>;
  }

  return <CreateFeedingClient babyId={babyId} />;
}
