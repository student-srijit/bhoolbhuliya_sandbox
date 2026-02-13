import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "bhoolbhulaiya — Polymorphic Frontend Shield",
  description:
    "Adaptive defense for Web3 frontends. Polymorphic UI, AI honeypots, and live threat telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="mp-root">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
