"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  DEFAULT_TIMEZONE,
  TIMEZONE_STORAGE_KEY,
} from "@/lib/config/timezone.config";

interface TimezoneContextValue {
  timeZoneId: string;
  setTimeZoneId: (tz: string) => void;
}

const TimezoneContext = createContext<TimezoneContextValue>({
  timeZoneId: DEFAULT_TIMEZONE,
  setTimeZoneId: () => {},
});

export function TimezoneProvider({ children }: React.PropsWithChildren) {
  const [timeZoneId, setTimeZoneIdState] = useState(DEFAULT_TIMEZONE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TIMEZONE_STORAGE_KEY);
    if (stored) {
      setTimeZoneIdState(stored);
    }
    setMounted(true);
  }, []);

  const setTimeZoneId = useCallback((tz: string) => {
    setTimeZoneIdState(tz);
    localStorage.setItem(TIMEZONE_STORAGE_KEY, tz);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <TimezoneContext.Provider value={{ timeZoneId, setTimeZoneId }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  return useContext(TimezoneContext);
}
