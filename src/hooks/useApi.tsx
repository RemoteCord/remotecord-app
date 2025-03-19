import { useSupabaseContextProvider } from "@/contexts/SupabaseContext";
import { ClientOptions, fetch } from "@tauri-apps/plugin-http";
import { useStoreTauri } from "./useStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useApi = () => {
  const { supabase } = useSupabaseContextProvider();
  const { getRecord } = useStoreTauri();
  const request = async (
    input: URL | Request | string,
    init?: RequestInit & ClientOptions
  ) => {
    const { session } = (await supabase?.auth.getSession())?.data || {};
    const auth = (await getRecord("auth")) as {
      token: string;
    };
    const { token } = auth;
    console.log("session", session);
    const headersData = {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
        ...init?.headers,
      },
      ...init,
    };

    try {
      const response = await fetch(`${API_URL}${input}`, headersData);
      return await response.json();
    } catch (err: any) {
      throw err;
    }
  };
  return { request };
};
