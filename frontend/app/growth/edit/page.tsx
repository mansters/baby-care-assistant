import React from "react";
import { growthService } from "@/lib/services/growth/growth.service.server";
import EditGrowthClient from "./EditGrowthClient";

interface EditGrowthPageProps {
  searchParams: Promise<{ babyId: string; sk: string }>;
}

export default async function EditGrowthPage({
  searchParams,
}: EditGrowthPageProps) {
  const { babyId, sk } = await searchParams;
  const log = await growthService.getById(babyId, sk);

  if (!log) {
    return <div>Error: Growth log not found.</div>;
  }

  return <EditGrowthClient initialData={log} />;
}
