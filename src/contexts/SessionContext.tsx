"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { load } from "@tauri-apps/plugin-store";

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

  useEffect(() => {
    const handleFetchStore = async () => {
      const store = await load("store.json", { autoSave: false });
      const data = await store.get<{ session: string }>("session");
      console.log("data", data);
      setSession(data?.session);
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
