import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Providers from "./providers";
import React from "react";

export const viewport: Viewport = {
    viewportFit: 'cover',
};

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