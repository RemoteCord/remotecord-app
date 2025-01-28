"use client";

import KeyContextProvider from "@/contexts/KeyContext";
import { useSessionContextProvider } from "@/contexts/SessionContext";
import WsContextProvider from "@/contexts/WsContext";

export function LayoutSession({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session } = useSessionContextProvider();

  if (session) {
    return <div>loading...</div>;
  }

  return (
    <WsContextProvider>
      <KeyContextProvider>{children}</KeyContextProvider>
    </WsContextProvider>
  );
}
