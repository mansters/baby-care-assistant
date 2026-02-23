"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Container,
  Stack,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { differenceInMonths, differenceInDays } from "date-fns";
import { FiTrendingUp, FiAward } from "react-icons/fi";
import { IoMdMoon } from "react-icons/io";
import { MdBabyChangingStation } from "react-icons/md";
import { TbBabyBottle } from "react-icons/tb";
import { FaSyringe } from "react-icons/fa";
import { BabyDto } from "@/lib/services/user";
import FeatureCard from "./FeatureCard";
import WavySeparator from "@/components/WavySeparator";
import { FeatureTheme } from "@/lib/theme";
import React, { useEffect, useState } from "react";
import TimezoneSwitcher from "@/shared/components/TimezoneSwitcher";
import useToastFromParams from "@/shared/hooks/useParamsMessage";
import { useNextFeeding } from "@/features/home/hooks/useNextFeeding";

interface HomePageProps {
  baby: BabyDto;
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

export default function HomePage({ baby }: HomePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const babyAge = formatBabyAge(baby.dateOfBirth);
  const babyName = getBabyDisplayName(baby);

  const notification = useToastFromParams();
  const { lastFeedingDisplay, nextFeedingDisplay } = useNextFeeding(baby.id);

  const features = [
    {
      icon: <TbBabyBottle />,
      title: "Feeding",
      subtitle: lastFeedingDisplay ? `Last: ${lastFeedingDisplay}` : undefined,
      badge: nextFeedingDisplay ? `Next: ${nextFeedingDisplay}` : undefined,
      backgroundColor: "#FFE5EC",
      iconColor: FeatureTheme.feeding.primary,
      href: "/feeding/new",
    },
    {
      icon: <IoMdMoon />,
      title: "Sleep",
      subtitle: "1h 20min",
      backgroundColor: "#E5F4FF",
      iconColor: "#4ECDC4",
      href: "/sleep",
    },
    {
      icon: <MdBabyChangingStation />,
      title: "Diaper",
      subtitle: "30 min ago",
      backgroundColor: "#FFF3E0",
      iconColor: "#FFB347",
      href: "/diaper",
    },
    {
      icon: <FiTrendingUp />,
      title: "Growth",
      subtitle: "6.5kg / 62cm",
      backgroundColor: "#E8F5E9",
      iconColor: "#66BB6A",
      href: "/growth/new",
    },
    {
      icon: <FaSyringe />,
      title: "Vaccine",
      subtitle: "Next: Mar 15",
      backgroundColor: "#EDE7F6",
      iconColor: "#786dce",
      href: "/vaccine",
    },
    {
      icon: <FiAward />,
      title: "Milestone",
      subtitle: "Roll over ✓",
      backgroundColor: "#FCE4EC",
      iconColor: "#E91E63",
      href: "/milestone",
    },
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
            <IconButton
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#FFFFFF",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
            >
              <TimezoneSwitcher variant="inline" />
            </IconButton>
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
    </Box>
  );
}
