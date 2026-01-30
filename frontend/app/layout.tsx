import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import Providers from "./providers";
import React from "react";

export const metadata: Metadata = {
    title: "BabyCare Assistant",
    description: "Newborn tracking for busy parents",
};

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
    return (
        <html lang="en">
        <body>
        <Providers>
            <ThemeRegistry>
                {children}
            </ThemeRegistry>
        </Providers>
        </body>
        </html>
    );
}