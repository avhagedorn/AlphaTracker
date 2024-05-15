import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlphaTracker",
  description: "Track your portfolio against the market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactQueryClientProvider>
        <body>{children}</body>
      </ReactQueryClientProvider>
    </html>
  );
}
