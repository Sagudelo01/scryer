import type { Metadata } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { VisibilityPauser } from "@/components/ui/VisibilityPauser";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

const display = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scryer — Fearless Draft & Live Scouting for Competitive League",
  description:
    "Scryer is a Fearless Draft simulator and live scouting tool for the amateur competitive League of Legends scene. Draft a full best-of series with champions locked across games.",
  keywords: [
    "League of Legends",
    "Fearless Draft",
    "draft simulator",
    "esports",
    "scouting",
    "amateur competitive",
  ],
  authors: [{ name: "Sagudelo01" }],
  openGraph: {
    title: "Scryer — Fearless Draft & Live Scouting",
    description:
      "Draft a full best-of series with the Fearless ruleset and scout the champion pool in real time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <AmbientBackground />
        <VisibilityPauser />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
