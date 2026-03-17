"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Snackbar, Alert } from "@mui/material";
import FeedingForm from "@/features/feeding/components/FeedingForm";
import { FeatureTheme } from "@/lib/theme";
import type { FeedingFormValues } from "@/lib/schemas/feeding.schema";
import FormPageFrame from "@/shared/components/FormPageFrame";
import { updateFeedingLog } from "../actions";
import { FeedingLog } from "@/lib/types";
import { utcToLocalDate, localToUtc } from "@/lib/utils/datetime";
import { useTimezone } from "@/lib/contexts/timezone.context";

interface EditFeedingClientProps {
  initialData: FeedingLog;
}

export default function EditFeedingClient({
  initialData,
}: EditFeedingClientProps) {
  const router = useRouter();
  const { timeZoneId } = useTimezone();
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSave = async (data: FeedingFormValues) => {
    setIsSaving(true);
    try {
      const utcData = {
        ...data,
        startTime: localToUtc(data.startTime, timeZoneId),
      };
      await updateFeedingLog(initialData.sk, utcData, initialData.babyId);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      console.error("Error updating feeding:", error);
      setSnackbar({
        open: true,
        message: "Failed to update feeding.",
        severity: "error",
      });
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formInitialData: Partial<FeedingFormValues> = {
    startTime: utcToLocalDate(initialData.eventTimeUtc, timeZoneId),
    type: initialData.type === "Breast" ? "Nursing" : "Bottle",
    leftDuration: initialData.leftBreastDurationMinutes || 0,
    rightDuration: initialData.rightBreastDurationMinutes || 0,
    amountMl: initialData.amountMl,
    note: initialData.note || "",
  };

  return (
    <FormPageFrame
      title="Edit Feeding"
      themeColor={FeatureTheme.feeding.primary}
      onBack={() => router.push("/home")}
      formId="feeding-form"
      isSaving={isSaving}
    >
      <FeedingForm
        onSubmit={handleSave}
        initialData={formInitialData}
        isEditing={true}
      />
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
