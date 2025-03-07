"use client";

import { createContext, useContext, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useStoreTauri } from "@/hooks/shared/useStore";
import { WsService } from "@/services/client";
import { useSupabaseContextProvider } from "./SupabaseContext";
import { useLogContextProvider } from "./LogContext";

export type Events =
  | "uploadFile"
  | "getFilesFolder"
  | "getFileFromClient"
  | "getTasksFromClient"
  | "runCmdCommand";

const WsContext = createContext<
  | {
      wss: Socket | null;
      connected: boolean;
      connect: (controllerid: string, username: string) => Promise<void>;
    }
  | undefined
>(undefined);

const WsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [wss, setWss] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { appendLog } = useLogContextProvider();
  const { getRecord } = useStoreTauri();

  const connect = async (tokenController: string, username: string) => {
    if (!tokenController) {
      console.error("No controllerid token provided to connect function");
      return;
    }

    const { token } = (await getRecord("auth")) as {
      token: string;
    };
    console.log("authtoken", token);

    console.log("Connecting to ws-client", tokenController, token);
    const socket = io("wss://api2.luqueee.dev/clients", {
      query: {
        tokenController,
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

    socket.on("getScreensFromClient", wsService.getScreensFromClient);

    socket.on("uploadFile", wsService.uploadFile);

    socket.on("getFilesFolder", wsService.getFilesFolder);

    socket.on("getFileFromClient", wsService.getFileFromClient);

    socket.on("getTasksFromClient", wsService.getTasksFromClient);

    socket.on("runCmdCommand", wsService.runCmdCommand);

    socket.onAny((eventName: Events, ...args) => {
      console.log("onAny", eventName, args);
      appendLog({
        type: eventName,
        controller: username,
        context: "",
      });
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
    throw new Error(
      "WsContextProvider must be used within a WsContextProvider"
    );
  }

  return context;
};

export default WsContextProvider;
