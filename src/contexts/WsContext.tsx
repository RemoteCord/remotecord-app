"use client";

// import WebSocket from "@tauri-apps/plugin-websocket";
import { createContext, useContext, useState } from "react";
// import io from "socket.io-client";
import { io, type Socket } from "socket.io-client";

import WebSocket from "@tauri-apps/plugin-websocket";
import { useStoreTauri } from "@/hooks/useStore";
import { ClientFileService, Folders, WsService } from "@/services/client";
import HttpClient from "@/client/HttpClient";
import { useSupabaseContextProvider } from "./SupabaseContext";

const WsContext = createContext<
  | {
      wss: Socket | null;
      connected: boolean;
      connect: () => Promise<void>;
    }
  | undefined
>(undefined);

const WsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [wss, setWss] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { getRecord } = useStoreTauri();
  const { getSession } = useSupabaseContextProvider();
  const connect = async () => {
    console.log("Connecting");

    const { token } = (await getRecord("auth")) as {
      token: string;
    };
    console.log("authtoken", token);
    const session = await getSession();
    console.log("Connecting to wss", session);
    const socket = io(`wss://api.luqueee.dev/clients`, {
      reconnectionDelayMax: 10000,
      query: {
        controllerid: "777460173115097098",
      },
      auth: {
        token,
      },
    });

    const wsService = new WsService(socket);

    socket.on("connect", () => {
      console.log("Connected");
      setWss(socket);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setWss(null);
    });

    socket.on("error", (error) => {
      console.log("Error", error);
    });

    socket.on("uploadFile", wsService.uploadFile);

    socket.on("getFilesFolder", wsService.getFilesFolder);

    socket.on("getFileFromClient", wsService.getFileFromClient);

    socket.on("getTasksFromClient", wsService.getTasksFromClient);

    socket.on("runCmdCommand", wsService.runCmdCommand);

    socket.on("hola", () => {
      console.log("hola");
    });
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
