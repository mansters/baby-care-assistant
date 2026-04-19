"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { WeightChart } from "@/features/growth";
import type { BabyDto } from "@/lib/services/user";
import type { GrowthLog } from "@/lib/types";
import { FeatureTheme } from "@/lib/theme";
import FormPageFrame from "@/shared/components/FormPageFrame";
import LogFilterBar from "@/features/log/components/LogFilterBar";
import { LogType } from "@/features/log/types";
import type { LogFilter } from "@/features/log/hooks/useLogList";
import FeedingChart from "@/features/feeding/components/FeedingChart";

interface InsightPageProps {
  baby: BabyDto;
  growthLogs: GrowthLog[];
}

export default function InsightPage({ baby, growthLogs }: InsightPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LogFilter>(LogType.Growth);

  // Gender validation for growth chart
  const babyGender =
    baby.gender === "Male" || baby.gender === "Female"
      ? (baby.gender as "Male" | "Female")
      : null;

  return (
    <FormPageFrame
      title="Insight"
      themeColor={FeatureTheme.insight.primary}
      onBack={() => router.back()}
    >
      {/* Tab */}
      <Box sx={{ borderBottom: "1px solid #eee" }}>
        <LogFilterBar
          activeFilter={activeTab}
          onFilterChange={setActiveTab}
          activeBgColor={FeatureTheme.insight.primary}
          showAll={false}
        />
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {activeTab === LogType.Growth ? (
          babyGender ? (
            <WeightChart
              growthLogs={growthLogs}
              babyDateOfBirth={baby.dateOfBirth}
              babyGender={babyGender}
              babyTimeZone={baby.timeZone}
            />
          ) : (
            <Typography sx={{ textAlign: "center", color: "#999", mt: 4 }}>
              Gender required for growth chart
            </Typography>
          )
        ) : activeTab === LogType.Feeding ? (
          <FeedingChart babyId={baby.id} />
        ) : (
          <Typography sx={{ textAlign: "center", color: "#999", mt: 4 }}>
            More charts coming soon...
          </Typography>
        )}
      </Box>
    </FormPageFrame>
  );
}
