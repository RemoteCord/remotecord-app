"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { load } from "@tauri-apps/plugin-store";
import { usePathname } from "next/navigation";
import { useStoreTauri } from "@/hooks/useStore";

const SessionContext = createContext<
  | {
      session: string | undefined;
    }
  | undefined
>(undefined);

const SessionContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [session, setSession] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const { getRecord, getAllRecords } = useStoreTauri();

  useEffect(() => {
    const handleFetchStore = async () => {
      const data = (await getRecord("auth")) as string;
      const allrecord = await getAllRecords();
      console.log("session", data, pathname, allrecord);

      setSession(data);
      if (!data && pathname !== "/auth") {
        window.location.href = "/auth";
      }
    };
    handleFetchStore();
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContextProvider = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("bla bla");
  }

  return context;
};

export default SessionContextProvider;
