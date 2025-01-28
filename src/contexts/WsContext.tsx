"use client";

// import WebSocket from "@tauri-apps/plugin-websocket";
import { createContext, useContext, useState } from "react";
// import io from "socket.io-client";
import WebSocket from "isomorphic-ws"; // Import WebSocket

const WsContext = createContext<
  | {
      wss: WebSocket | null;
      connected: boolean;
      connect: () => Promise<void>;
    }
  | undefined
>(undefined);

const WsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [wss, setWss] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const connect = async () => {
    console.log("Connecting");

    const ws = new WebSocket(
      "wss://api.luqueee.dev?username=aaa&controller=aaaabcbcwe"
    );

    setWss(ws);

    ws.onopen = () => {
      console.log("Connected to server");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("message", event.data);
    };

    ws.onclose = () => {
      setConnected(false);
    };
  };

  return (
    <WsContext.Provider value={{ wss, connect, connected }}>
      {children}
    </WsContext.Provider>
  );
};

export const useWsContextProvider = () => {
  const context = useContext(WsContext);
  if (context === undefined) {
    throw new Error("bla bla");
  }

  return context;
};

export default WsContextProvider;
