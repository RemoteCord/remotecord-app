"use client";

import localFont from "next/font/local";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import SupabaseContextProvider from "@/contexts/SupabaseContext";
import { usePathname } from "next/navigation";
import { useStoreTauri } from "@/hooks/useStore";
import { useDeviceDetection } from "@/hooks/use-useragent";

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
  const { getRecord } = useStoreTauri();
  const device = useDeviceDetection();
  const pathname = usePathname();

  // useEffect(() => {
  //   () => async () => {
  //     await onOpenUrl((urls) => {
  //       console.log("deep link:", urls);
  //     });
  //   };
  // }, []);

  useEffect(() => {
    void getRecord("auth").then((auth) => {
      if (!auth && pathname !== "/auth") {
        console.log("no auth token");

        window.location.href = "/auth";
      }
    });
  }, [pathname]);
  return (
    <html lang="en" className="dark h-screen w-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen m-0 p-0  box-border overflow-x-hidden `}
      >
        <SupabaseContextProvider>
          <Toaster />
          <main className="w-screen h-screen grid grid-rows-[auto_1fr]">
            {children}
          </main>
        </SupabaseContextProvider>
      </body>
    </html>
  );
}
