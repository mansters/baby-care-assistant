"use client";

import { usePathname } from "next/navigation";
import { useTimezone } from "@/lib/contexts/timezone.context";
import { TIMEZONE_OPTIONS } from "@/lib/config/timezone.config";

interface TimezoneSwitcherProps {
  variant?: "floating" | "inline";
}

const HIDDEN_PATHS = ["/home"];

export default function TimezoneSwitcher({
  variant = "floating",
}: TimezoneSwitcherProps) {
  const pathname = usePathname();
  const { timeZoneId, setTimeZoneId } = useTimezone();

  if (variant === "floating" && HIDDEN_PATHS.includes(pathname)) return null;

  const current =
    TIMEZONE_OPTIONS.find((tz) => tz.id === timeZoneId) ?? TIMEZONE_OPTIONS[0];
  const next =
    TIMEZONE_OPTIONS.find((tz) => tz.id !== timeZoneId) ?? TIMEZONE_OPTIONS[1];

  const handleToggle = () => {
    setTimeZoneId(next.id);
  };

  if (variant === "inline") {
    return (
      <button
        onClick={handleToggle}
        aria-label={`Switch to ${next.label} timezone`}
        title={`${current.label} → Click to switch to ${next.label}`}
        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl hover:shadow-lg active:scale-95 transition-all"
      >
        {current.flag}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${next.label} timezone`}
      title={`${current.label} → Click to switch to ${next.label}`}
      className="fixed top-3 right-3 z-50 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center cursor-pointer text-xl hover:shadow-lg active:scale-95 transition-all"
    >
      {current.flag}
    </button>
  );
}
