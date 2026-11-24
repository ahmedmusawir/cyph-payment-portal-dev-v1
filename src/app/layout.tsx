import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./providers/ThemeProvider";

import { BRAND } from "@/components/portal/brand";

// ABM007_FINAL: Inter 400 to 700 via next/font (self-hosted at build), replacing Saira.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: `${BRAND.subline} · ${BRAND.name}`,
  description: `${BRAND.name} ${BRAND.subline}: your subscription, pharmacies and invoices.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ABM007_FINAL (D-01): light only. No "dark" class ships on <html>, and
  // next-themes is forced to light so a saved or system preference cannot apply.
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-brand">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
