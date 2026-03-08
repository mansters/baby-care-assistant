import React from "react";
import CreateGrowthClient from "./CreateGrowthClient";
import { userService } from "@/lib/services/user/user.service.server";

export default async function GrowthNewPage() {
  const userContext = await userService.getMyContext();
  const firstFamily = userContext.families?.[0];
  const firstBaby = firstFamily?.babies?.[0];
  const babyId = firstBaby?.id;

  if (!babyId) {
    return <div>Error: No baby found. Please create a baby profile first.</div>;
  }

  return <CreateGrowthClient babyId={babyId} />;
}
