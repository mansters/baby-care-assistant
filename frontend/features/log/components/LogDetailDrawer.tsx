"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Button } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { formatLocalDate } from "@/lib/utils/datetime";
import { LogEntry } from "@/features/log/types";
import { getDrawerRenderer } from "@/features/log/strategies/registry";
import { FeatureTheme } from "@/lib/theme/feature-theme";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useTimezone } from "@/lib/contexts/timezone.context";

interface LogDetailDrawerProps {
  entry: LogEntry | null;
  onClose: () => void;
  onDelete: (entry: LogEntry) => void;
}

export default function LogDetailDrawer({
  entry,
  onClose,
  onDelete,
}: LogDetailDrawerProps) {
  const router = useRouter();
  const { timeZoneId } = useTimezone();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const strategy = entry ? getDrawerRenderer(entry.type, entry.details) : null;
  const featureKey = strategy?.getFeatureKey();
  const theme = featureKey
    ? FeatureTheme[featureKey as keyof typeof FeatureTheme]
    : null;
  const dateStr = entry
    ? formatLocalDate(entry.startTime, "EEEE, dd MMM yyyy • h:mm a", timeZoneId)
    : "";

  const handleUpdate = () => {
    if (!entry || !strategy) return;
    onClose();
    router.push(strategy.getUpdatePath(entry.details.babyId, entry.details.sk));
  };

  const handleDeleteConfirm = () => {
    if (!entry) return;
    setDeleteDialogOpen(false);
    onClose();
    onDelete(entry);
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={!!entry}
        onClose={onClose}
        onOpen={() => {}}
        disableSwipeToOpen
        transitionDuration={{ enter: 350, exit: 250 }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "24px 24px 0 0",
              maxWidth: "600px",
              mx: "auto",
            },
          },
        }}
      >
        {entry && strategy && (
          <div className="relative px-6 pt-8 pb-6">
            {/* Drag indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center p-0"
            >
              <IoClose size={20} color="#6a7282" />
            </button>

            {/* Date header */}
            <p className="text-center text-sm text-gray-500 m-0 leading-5 font-normal">
              {dateStr}
            </p>

            {/* Feature icon */}
            <div className="flex justify-center mt-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme?.primary || "#6b7280" }}
              >
                {strategy.getDrawerIcon(entry.details)}
              </div>
            </div>

            {/* Primary info */}
            <p className="text-center text-5xl font-bold text-gray-900 mt-6 mb-0 leading-[48px] tracking-tight">
              {strategy.getPrimaryInfo(entry.details)}
            </p>

            {/* Secondary info */}
            <p className="text-center text-base font-normal text-gray-600 mt-2 mb-0 leading-6">
              {strategy.getSecondaryInfo(entry.details)}
            </p>

            {/* Note section */}
            {entry.note && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900 mb-1">Note</p>
                <p className="text-sm text-gray-500 leading-5 m-0">
                  {entry.note}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <Button
                onClick={handleUpdate}
                className="h-14 rounded-[14px] text-base font-semibold tracking-tight uppercase"
                style={{
                  backgroundColor: theme?.primary || "#6b7280",
                  color: "#ffffff",
                  borderRadius: 14,
                  height: 56,
                }}
              >
                Update Entry
              </Button>
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                className="h-[60px] rounded-[14px] text-base font-semibold tracking-tight uppercase"
                style={{
                  border: `2px solid ${theme?.primary || "#6b7280"}`,
                  backgroundColor: "#ffffff",
                  color: theme?.primary || "#6b7280",
                  borderRadius: 14,
                  height: 60,
                }}
              >
                Delete Record
              </Button>
            </div>
          </div>
        )}
      </SwipeableDrawer>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        loading={false}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
