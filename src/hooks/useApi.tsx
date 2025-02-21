"use client";

import { AxiosOptions } from "@/client/HttpClient";
import { useStoreTauri } from "./useStore";
import { env } from "@/env.config";
import { fetch } from "@tauri-apps/plugin-http";

export const useApi = () => {
  const { getRecord } = useStoreTauri();

  const request = async (config: AxiosOptions) => {
    const authtoken = await getRecord("auth");

    const headers = {
      Authorization: `Bearer ${authtoken}`,
      ...config.headers,
    };

    // Don't stringify if it's FormData
    const body =
      config.data instanceof FormData
        ? config.data
        : JSON.stringify(config.data);

    const url = `${env.NEXT_PUBLIC_API_URL}${config.url}`;

    return await fetch(url, {
      method: config.method,
      headers,
      body,
    });
  };

  return { request };
};
