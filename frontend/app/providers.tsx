"use client";

import { Amplify } from "aws-amplify";
import { Hub } from "aws-amplify/utils";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { amplifyConfig } from "@/lib/amplify-config";
import { TimezoneProvider } from "@/lib/contexts/timezone.context";
import TimezoneSwitcher from "@/shared/components/TimezoneSwitcher";

Amplify.configure(amplifyConfig, { ssr: true });

export default function Providers({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          router.push("/home");
          router.refresh();
          break;
        case "signedOut":
          router.push("/login");
          router.refresh();
          break;
        case "tokenRefresh_failure":
          router.push("/login");
          router.refresh();
          break;
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <TimezoneProvider>
      {["/home", "/logs"].includes(pathname) && <TimezoneSwitcher />}
      {children}
    </TimezoneProvider>
  );
}
