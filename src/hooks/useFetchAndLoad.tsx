"use client";
import { useState } from "react";
import { ClientOptions, fetch } from "@tauri-apps/plugin-http";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log(API_URL);

const useFetchAndLoad = () => {
  const [loading, setLoading] = useState(false);

  const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    input: URL | Request | string,
    init?: RequestInit & ClientOptions
  ) => {
    setLoading(true);

    let result;

    try {
      const response = await fetch(`${API_URL}${input}`, {
        method,
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
      });

      const data = await response.json();
      result = data;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }

    console.log(result);
    setLoading(false);
    return result;
  };
  return { loading, request };
};
export default useFetchAndLoad;
