"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Snackbar, Alert } from "@mui/material";
import GrowthForm from "@/features/growth/components/GrowthForm";
import { FeatureTheme } from "@/lib/theme";
import type { GrowthFormValues } from "@/lib/schemas/growth.schema";
import FormPageFrame from "@/shared/components/FormPageFrame";
import { createGrowthLog } from "../actions";
import { localToUtc } from "@/lib/utils/datetime";
import { useTimezone } from "@/lib/contexts/timezone.context";

interface CreateGrowthClientProps {
  babyId: string;
}

export default function CreateGrowthClient({
  babyId,
}: CreateGrowthClientProps) {
  const router = useRouter();
  const { timeZoneId } = useTimezone();
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSave = async (data: GrowthFormValues) => {
    setIsSaving(true);
    try {
      const utcData = {
        ...data,
        startTime: localToUtc(data.startTime, timeZoneId),
      };
      await createGrowthLog(utcData, babyId);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to save growth log.",
        severity: "error",
      });
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <FormPageFrame
      title="Add Growth"
      themeColor={FeatureTheme.growth.primary}
      onBack={() => router.push("/home")}
      formId="growth-form"
      isSaving={isSaving}
    >
      <GrowthForm onSubmit={handleSave} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FormPageFrame>
  );
}
