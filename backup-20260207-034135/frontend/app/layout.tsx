import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// T022: Root layout with Better Auth provider setup
// TODO: T025 - Add Better Auth provider when configured in Phase 3

export const metadata: Metadata = {
  title: "Todo App - Evolution of Todo",
  description: "Modern todo application built with Next.js and FastAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#fafafa", color: "#1e293b" }}
      >
        {children}
      </body>
    </html>
  );
}
