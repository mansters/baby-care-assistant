import React from "react";
import { growthService } from "@/lib/services/growth/growth.service.server";
import EditGrowthClient from "./EditGrowthClient";

interface EditGrowthPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGrowthPage({ params }: EditGrowthPageProps) {
  const { id } = await params;
  const log = await growthService.getById(id);

  if (!log) {
    return <div>Error: Growth log not found.</div>;
  }

  return <EditGrowthClient initialData={log} />;
}
