"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  Container,
  Stack,
  Grid,
  Snackbar,
  Alert,
  Fab,
} from "@mui/material";
import { differenceInMonths, differenceInDays, format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { FiTrendingUp, FiAward } from "react-icons/fi";
import { IoMdMoon } from "react-icons/io";
import { MdBabyChangingStation } from "react-icons/md";
import { TbBabyBottle } from "react-icons/tb";
import { FaSyringe, FaListUl } from "react-icons/fa";
import { BabyDto } from "@/lib/services/user";
import FeatureCard from "./FeatureCard";
import WavySeparator from "@/components/WavySeparator";
import { FeatureTheme } from "@/lib/theme";
import React, { useMemo } from "react";
import TimezoneSwitcher from "@/shared/components/TimezoneSwitcher";
import useToastFromParams from "@/shared/hooks/useParamsMessage";
import type { NextFeedingDto } from "@/lib/services/feeding/feeding.service";
import type { GrowthLog } from "@/lib/types";
import { formatLocalDate } from "@/lib/utils/datetime";
import { useTimezone } from "@/lib/contexts/timezone.context";

interface HomePageProps {
  baby: BabyDto;
  nextFeedingData: NextFeedingDto | null;
  latestGrowth: GrowthLog | null;
}

function formatBabyAge(dateOfBirth: string): string {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const months = differenceInMonths(now, dob);
  const days = differenceInDays(now, dob) % 30;

  if (months === 0) {
    return `${days} days`;
  }
  return `${months} months ${days} days`;
}

function getBabyDisplayName(baby: BabyDto): string {
  return baby.preferredName || baby.firstName;
}

function formatGrowthWording(
  latestGrowth: GrowthLog | null,
  babyTimeZone?: string,
): string | null {
  if (!latestGrowth) return null;

  const dataString = `${latestGrowth.weightKg}kg${latestGrowth.heightCm ? ` / ${latestGrowth.heightCm}cm` : ""}`;
  const timeZoneToUse = babyTimeZone || "Pacific/Auckland";

  if (!latestGrowth.localDate) {
    return dataString;
  }

  const recordDate = new TZDate(
    `${latestGrowth.localDate}T00:00:00`,
    timeZoneToUse,
  );
  const today = new TZDate(new Date(), timeZoneToUse);
  const startOfToday = new TZDate(
    `${format(today, "yyyy-MM-dd")}T00:00:00`,
    timeZoneToUse,
  );
  const diffDays = differenceInDays(startOfToday, recordDate);

  if (diffDays === 0) return `Today: ${dataString}`;
  if (diffDays === 1) return `Yesterday: ${dataString}`;
  if (diffDays <= 15) return `${diffDays} days ago: ${dataString}`;
  return `${format(recordDate, "dd MMM")}: ${dataString}`;
}

export default function HomePage({
  baby,
  nextFeedingData,
  latestGrowth,
}: HomePageProps) {
  const router = useRouter();
  const { timeZoneId } = useTimezone();
  const babyAge = formatBabyAge(baby.dateOfBirth);
  const babyName = getBabyDisplayName(baby);

  const notification = useToastFromParams();

  const lastFeedingDisplay = useMemo(() => {
    if (!nextFeedingData?.lastFeedingTime) return null;
    return formatLocalDate(
      nextFeedingData.lastFeedingTime,
      "HH:mm",
      timeZoneId,
    );
  }, [nextFeedingData, timeZoneId]);

  const nextFeedingDisplay = useMemo(() => {
    if (!nextFeedingData?.nextFeedingTime) return null;
    return formatLocalDate(
      nextFeedingData.nextFeedingTime,
      "HH:mm",
      timeZoneId,
    );
  }, [nextFeedingData, timeZoneId]);

  const latestGrowthWording = useMemo(
    () => formatGrowthWording(latestGrowth, baby.timeZone),
    [latestGrowth, baby.timeZone],
  );

  const features = [
    {
      icon: <FiTrendingUp />,
      title: "Growth",
      subtitle: latestGrowthWording || undefined,
      backgroundColor: "#E8F5E9",
      iconColor: "#66BB6A",
      href: "/growth/new",
    },
    {
      icon: <TbBabyBottle />,
      title: "Feeding",
      subtitle: lastFeedingDisplay ? `Last: ${lastFeedingDisplay}` : undefined,
      badge: nextFeedingDisplay ? `Next: ${nextFeedingDisplay}` : undefined,
      backgroundColor: "#FFE5EC",
      iconColor: FeatureTheme.feeding.primary,
      href: "/feeding/new",
    },
    // {
    //   icon: <IoMdMoon />,
    //   title: "Sleep",
    //   subtitle: "1h 20min",
    //   backgroundColor: "#E5F4FF",
    //   iconColor: "#4ECDC4",
    //   href: "/sleep",
    // },
    // {
    //   icon: <MdBabyChangingStation />,
    //   title: "Diaper",
    //   subtitle: "30 min ago",
    //   backgroundColor: "#FFF3E0",
    //   iconColor: "#FFB347",
    //   href: "/diaper",
    // },
    // {
    //   icon: <FaSyringe />,
    //   title: "Vaccine",
    //   subtitle: "Next: Mar 15",
    //   backgroundColor: "#EDE7F6",
    //   iconColor: "#786dce",
    //   href: "/vaccine",
    // },
    // {
    //   icon: <FiAward />,
    //   title: "Milestone",
    //   subtitle: "Roll over ✓",
    //   backgroundColor: "#FCE4EC",
    //   iconColor: "#E91E63",
    //   href: "/milestone",
    // },
  ];

  return (
    <Box
      sx={{
        minHeight: "100svh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #786dce 0%, #a89ad8 100%)",
          padding: { xs: "24px 20px 70px", sm: "32px 24px 70px" },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "#FFFFFF",
                color: "#786dce",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              {babyName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                }}
              >
                {babyName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {babyAge}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#FFFFFF",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
            >
              <TimezoneSwitcher variant="inline" />
            </Box>
          </Stack>
        </Stack>
      </Box>

      <WavySeparator />

      <Container maxWidth="sm" sx={{ py: 3, flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1A1A2E",
            mb: 2,
          }}
        >
          Today&apos;s Records
        </Typography>

        <Grid container spacing={1.5}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 6 }}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {notification}

      <Fab
        color="primary"
        aria-label="logs"
        onClick={() => router.push("/logs")}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 24,
          backgroundColor: "#786dce",
          "&:hover": {
            backgroundColor: "#5a52a3",
          },
          boxShadow: 3,
        }}
      >
        <FaListUl size={20} color="#FFFFFF" />
      </Fab>
    </Box>
  );
}
