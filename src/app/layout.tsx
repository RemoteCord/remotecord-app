"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";

import { LayoutSession } from "@/components/test-components/LayoutSession";
import { cookies } from "next/headers";
import SessionContextProvider from "@/contexts/SessionContext";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect } from "react";
import SupabaseContextProvider from "@/contexts/SupabaseContext";
import { Providers } from "@/contexts/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    () => async () => {
      await onOpenUrl((urls) => {
        console.log("deep link:", urls);
      });
    };
  }, []);
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen m-0 p-0  box-border overflow-x-hidden`}
      >
        <Providers>
          <AppSidebar />
          <main className="w-full p-4">
            <SidebarTrigger />
            <div className="overflow-y-auto h-full">
              <SessionContextProvider>
                <LayoutSession>{children}</LayoutSession>
              </SessionContextProvider>
            </div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
