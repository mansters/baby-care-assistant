import React from "react";
import CreateGrowthClient from "./CreateGrowthClient";

export default async function GrowthNewPage() {
  let babyId = "";
  try {
    const res = await fetch("http://localhost:5280/api/Baby", {
      cache: "no-store",
    });
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

  return <CreateGrowthClient babyId={babyId} />;
}
