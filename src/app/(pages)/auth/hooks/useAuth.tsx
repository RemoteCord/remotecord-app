import HttpClient from "@/client/HttpClient";
import { useSupabaseContextProvider } from "@/contexts/SupabaseContext";
import { useStoreTauri } from "@/hooks/useStore";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

function getLocalHostUrl(port: number) {
  return `http://localhost:${port}`;
}
export const useAuth = () => {
  const { supabase, getSession, signOut } = useSupabaseContextProvider();
  const { insertRecord, getAllRecords } = useStoreTauri();
  const [port, setPort] = useState<number | null>(null);
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log("Session active:", session);
        }
      });
    }
  }, [supabase]);
  useEffect(() => {
    let _port: number | null = null;
    const unlisten = listen("oauth://url", (data) => {
      setPort(null);
      if (!data.payload) return;

      const url = new URL(data.payload as string);
      const code = new URLSearchParams(url.search).get("code");

      console.log("here", data.payload, code);
      if (code) {
        supabase?.auth.exchangeCodeForSession(code).then((res) => {
          if (!res.data.session) return;

          const { access_token } = res.data.session;
          console.log("res", res);

          void HttpClient.axios
            .post<{ data: { token: string; status: boolean } }>({
              url: "/auth/callback",
              data: {
                token: access_token,
              },
            })
            .then(async (res) => {
              console.log("res", res);
              const status = res.data.status;

              if (!status) {
                return supabase?.auth.signOut();
              }

              await insertRecord("auth", {
                token: res.data.token,
              });

              const aa = await getAllRecords();
              console.log("aa", aa);

              location.reload();
            });
        });
      }
    });

    invoke("plugin:oauth|start").then(async (port) => {
      console.log("port", port);
      setPort(port as number);
      _port = port as number;
    });

    return () => {
      unlisten.then((u) => u());
      if (_port) {
        invoke("plugin:oauth|cancel", { port: _port });
      }
    };
  }, [supabase]);

  const onProviderLogin = (provider: "google") => async () => {
    if (!supabase) return;
    const { data, error } = await supabase.auth.signInWithOAuth({
      options: {
        skipBrowserRedirect: true,
        scopes: provider === "google" ? "profile email" : "",
        redirectTo: getLocalHostUrl(port!),
      },
      provider: provider,
    });

    if (data.url) {
      open(data.url);
    } else {
      alert(error?.message);
    }
  };

  return { onProviderLogin, getSession, signOut };
};
