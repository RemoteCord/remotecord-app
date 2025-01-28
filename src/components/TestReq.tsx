"use client";

import { useWsContextProvider } from "@/contexts/WsContext";

export function TestRequest() {
  const { connect, wss } = useWsContextProvider();
  const req = async () => {
    const response = await fetch("https://api.luqueee.dev/");

    const data = await response.json();
    console.log(data);
  };

  const sendMessage = () => {
    if (wss) {
      wss.send(
        JSON.stringify({
          type: "difuse",
          message: "holaaaa",
        })
      );
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
    </div>
  );
}
