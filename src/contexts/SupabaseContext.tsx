"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { load } from "@tauri-apps/plugin-store";
import { usePathname } from "next/navigation";
import { useStoreTauri } from "@/hooks/shared/useStore";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const SupabaseContext = createContext<
  | {
      supabase: SupabaseClient<any, "public", any> | undefined;
      signOut: () => Promise<void>;
      session: Session | null;
    }
  | undefined
>(undefined);

const SupabaseContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [supabase, setSupabaseClient] =
    useState<SupabaseClient<any, "public", any>>();

  const [session, setSession] = useState<Session | null>(null);

  const { getAllRecords, getRecord } = useStoreTauri();
  useEffect(() => {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "CustomApp",
        storage: window.localStorage,
        flowType: "pkce",
      },
    });

    // supabaseClient.auth.onAuthStateChange(async (event, session) => {
    //   console.log("event", event, session);
    //   setSession(session);
    // });

    setSupabaseClient(supabaseClient);
    getSession(supabaseClient);
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error", error);
    }
  };

  const getSession = async (client: SupabaseClient) => {
    // const { data, error } = await client.auth.getUser(token);
    client.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("Session active:", session);
        setSession(session);
      }
    });
  };

  return (
    <SupabaseContext.Provider value={{ supabase, signOut, session }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseContextProvider = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("bla bla");
  }

  return context;
};

export default SupabaseContextProvider;
