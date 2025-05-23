// import { useStoreTauri } from "./useStore";
import { authStore } from "@/services";
import { env } from "@/shared/env.config";
import type { ClientOptions } from "@tauri-apps/plugin-http";
import { useNavigate } from "react-router-dom";

export const useApi = () => {
  //   const { supabase, session } = useSupabaseContextProvider();
  //   const { getRecord } = useStoreTauri();
  const navigator = useNavigate();
  const request = async <T,>(
    input: URL | Request | string,
    init?: RequestInit & ClientOptions
  ) => {
    try {
      // console.log("REQUEST TO", `${env.VITE_API_URL}${input}`);
      // if (!user) return;
      // if (!isAuthenticated) {
      //   navigator("/auth");
      //   return;
      // }
      const token = await authStore.getRecord<string>("token");
      // if (!token) navigator("/auth");
      // const { session } = (await supabase?.auth.getSession())?.data || {};
      // const { token } = auth;
      console.log("REQUEST TO", `${env.VITE_API_URL}${input}`, init);
      const headersData = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
          ...init?.headers,
        },
        ...init,
      };

      const response = await fetch(`${env.VITE_API_URL}${input}`, headersData);

      console.log("RESPONSE", response);

      const res = await response.json();

      console.log("RESPONSE DATA", res);

      return res as T;
    } catch (error) {
      console.log("ERROR", error);
      if (error instanceof Error) {
        console.log("ERROR MESSAGE", error.message);
      }
      if (error instanceof Response) {
        const res = await error.json();
        console.log("RESPONSE ERROR", res);
      }
    }
  };

  return { request };
};
