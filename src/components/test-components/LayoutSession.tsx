"use client";

import KeyContextProvider from "@/contexts/KeyContext";
import { useSessionContextProvider } from "@/contexts/SessionContext";
import WsContextProvider from "@/contexts/WsContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function LayoutSession({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session } = useSessionContextProvider();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {};

    getSession();
  }, [pathname]);

  return (
    <WsContextProvider>
      <KeyContextProvider>{children}</KeyContextProvider>
    </WsContextProvider>
  );
}
