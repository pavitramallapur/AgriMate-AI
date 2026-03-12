import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriMate AI",
  description: "Your intelligent assistant for maximizing crop yields",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AgriMate",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981", // Emerald 500
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-emerald-500/30`}>{children}</body>
    </html>
  );
}
