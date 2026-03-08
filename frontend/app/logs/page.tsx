import React from "react";
import LogListContainer from "@/features/log/components/LogListContainer";
import { userService } from "@/lib/services/user/user.service.server";

export default async function LogsPage() {
  const userContext = await userService.getMyContext();
  const firstFamily = userContext.families?.[0];
  const firstBaby = firstFamily?.babies?.[0];
  const babyId = firstBaby?.id;

  if (!babyId) {
    return <div>Error: No baby found. Please create a baby profile first.</div>;
  }

  return <LogListContainer babyId={babyId} />;
}
