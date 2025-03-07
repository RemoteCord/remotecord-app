"use client";

import HttpClient from "@/client/HttpClient";
import { useWsContextProvider } from "@/contexts/WsContext";
import { useApi } from "@/hooks/shared/useApi";
import { useStoreTauri } from "@/hooks/shared/useStore";
import { OsService } from "@/services/client/OsService";

export function TestRequest() {
  const { connect, wss } = useWsContextProvider();
  const { request } = useApi();
  const req = async () => {
    // const response = await fetch("https://api.luqueee.dev/");
    // const data = await response.json();
    // console.log(data);
    const res = await request("/protected", {
      method: "GET",
    });
    console.log("res", res);
  };

  const sendMessage = () => {
    if (wss) {
      wss.emit("hola", { aa: "aaa" });
    }
  };

  return (
    <div className="border p-4 flex gap-4 w-fit rounded-lg my-4">
      <button type="button" onClick={req}>
        Test Request
      </button>
      <button type="button" onClick={connect}>
        Test Wss
      </button>

      <button type="button" onClick={sendMessage}>
        send message
      </button>
      <button onClick={OsService.getClientInfo} type="button">
        Sys info
      </button>
      <button onClick={OsService.getTasks} type="button">
        Task info
      </button>
    </div>
  );
}
