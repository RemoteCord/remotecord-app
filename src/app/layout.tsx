"use client";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import SupabaseContextProvider from "@/contexts/SupabaseContext";
import { usePathname } from "next/navigation";
import { useStoreTauri } from "@/hooks/useStore";
// import { useDeviceDetection } from "@/hooks/use-useragent";
import { Inter } from "next/font/google";
import { useUpdater } from "@/client/updaterClient";

const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { updater } = useUpdater();

  const { getRecord } = useStoreTauri();
  // const device = useDeviceDetection();
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

  useEffect(() => {
    void updater();
  }, []);
  return (
    <html lang="en" className="dark h-screen w-screen">
      <body
        className={`${font.className} anti  aliased h-screen w-screen m-0 p-0  box-border overflow-x-hidden `}
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
