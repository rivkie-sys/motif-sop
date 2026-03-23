import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motif Studio SOPs",
  description: "Standard Operating Procedures Dashboard for Motif Studio",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-motif-cream font-basis">{children}</body>
    </html>
  );
}
