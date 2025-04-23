
import { StoreService } from "@/services/store";
import { env } from "@/shared/env.config";
import axios, { AxiosError } from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";

interface FetchOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  body?: string | FormData | URLSearchParams | any;
}

class FetchClient {
  private async customFetch<ResponseJSON>(
    config: FetchOptions
  ): Promise<ResponseJSON> {
    const url = `${config.url}`;

    Reflect.deleteProperty(config, "url");

    return fetch(url, config).then(async (response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const contentType = response.headers.get("Content-Type");
      switch (contentType) {
        case "text/plain":
          return (await response.text()) as unknown as Promise<ResponseJSON>;
        case "application/octet-stream":
          return (await response.arrayBuffer()) as unknown as Promise<ResponseJSON>;
        case "multipart/form-data":
        case "application/x-www-form-urlencoded":
          return (await response.formData()) as unknown as Promise<ResponseJSON>;
        default:
          return (await response.json()) as Promise<ResponseJSON>;
      }
    });
  }

  async get<ResponseJSON>(
    config: Omit<FetchOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customFetch<ResponseJSON>({ ...config, method: "GET" });
  }

  async post<ResponseJSON>(
    config: Omit<FetchOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customFetch<ResponseJSON>({ ...config, method: "POST" });
  }

  async patch<ResponseJSON>(
    config: Omit<FetchOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customFetch<ResponseJSON>({ ...config, method: "PATCH" });
  }

  async put<ResponseJSON>(
    config: Omit<FetchOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customFetch<ResponseJSON>({ ...config, method: "PUT" });
  }

  async delete<ResponseJSON>(
    config: Omit<FetchOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customFetch<ResponseJSON>({ ...config, method: "DELETE" });
  }
}

export interface AxiosOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string> & { session?: string };
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data?: string | FormData | URLSearchParams | any;
  params?: Record<string, string>;
}

const client = axios.create({ adapter: axiosTauriApiAdapter });
const authStore = new StoreService("auth");
const api_url = `${env.VITE_API_URL}`;
console.log("api_url", api_url);
class AxiosClient {
  private async customAxios<ResponseJSON>(
    config: AxiosOptions
  ): Promise<ResponseJSON> {
    const authtoken = await authStore.getRecord("access_token");

    // const token = await getSession();

    console.log("token fetch", authtoken);

    const headers = {
      "Content-Type": config.headers?.["Content-Type"] || "application/json",
      Authorization: `Bearer ${authtoken}`,
      ...config.headers,
    };

    // Remove undefined or extraneous keys that may cause issues with axios-tauri-api-adapter
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const { streamChannel, ...restConfig } = config as any;

    const customConfig = {
      ...restConfig,
      url: `${env.VITE_API_URL}${config.url}`,
    }

    console.log("config", customConfig, headers);

    return client<ResponseJSON>({
      ...customConfig,
      headers,
    }).then((response) => response.data);
  }

  async get<ResponseJSON>(
    config: Omit<AxiosOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customAxios<ResponseJSON>({
      ...config,
      method: "GET",
    });
  }

  async post<ResponseJSON>(
    config: Omit<AxiosOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customAxios<ResponseJSON>({
      ...config,
      method: "POST",
    });
  }

  async patch<ResponseJSON>(
    config: Omit<AxiosOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customAxios<ResponseJSON>({
      ...config,
      method: "PATCH",
    });
  }

  async put<ResponseJSON>(
    config: Omit<AxiosOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customAxios<ResponseJSON>({
      ...config,
      method: "PUT",
    });
  }

  async delete<ResponseJSON>(
    config: Omit<AxiosOptions, "method">
  ): Promise<ResponseJSON> {
    return this.customAxios<ResponseJSON>({
      ...config,
      method: "DELETE",
    });
  }
}

class HttpClient {
  static readonly axios: AxiosClient = new AxiosClient();
  static readonly fetch: FetchClient = new FetchClient();

  static handleErrors(error: unknown) {
    let { message = "An unknown error occurred" } = error as Error;
    if (error instanceof AxiosError) {
      const { response } = error;

      if (typeof response?.data === "object") {
        message =
          response?.data?.errors?.[0]?.message ||
          response?.data?.error?.message ||
          response?.data?.message;
      } else if (typeof response?.data === "string") {
        const trimmedData = response.data.trim();
        const errorText =
          trimmedData.length > 0 ? trimmedData : response.statusText;

        message = errorText;
      }
    }

    if (message.includes("<!DOCTYPE html>")) {
      message = "Unavailable Service";
    }

    return message;
  }
}

export default HttpClient;
