"use client";

import { createContext, useContext, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useStoreTauri } from "@/hooks/useStore";
import { WsService } from "@/services/client";
import { useLogContextProvider } from "./LogContext";
import { useWsClient } from "@/hooks/useWsClient";
import { env } from "@/env.config";

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
      file: {
        progress: number;
        total: number;
        filename: string;
      };
      downloading: boolean;
      connect: (controllerid: string, username: string) => Promise<void>;
    }
  | undefined
>(undefined);

const WsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { setWsService, file, downloading, UploadFile, AppendLog } =
    useWsClient();
  const [wss, setWss] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
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
    const socket = io(`${env.NEXT_PUBLIC_WS_URL}/clients`, {
      query: {
        tokenController,
      },
      auth: {
        token,
      },
    });

    const wsService = new WsService(socket);
    setWsService(wsService);

    socket.on("connect", () => {
      console.log("Connected");
      setWss(socket);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setWss(null);
    });

    socket.on("error", (error) => {
      console.log("Error", error);
    });

    socket.on("getScreensFromClient", wsService.getScreensFromClient);

    socket.on("getScreenshot", wsService.getScreenshot);

    socket.on("uploadFile", UploadFile);

    socket.on("getFilesFolder", wsService.getFilesFolder);

    socket.on("getFileFromClient", wsService.getFileFromClient);

    socket.on("getTasksFromClient", wsService.getTasksFromClient);

    socket.on("runCmdCommand", wsService.runCmdCommand);

    socket.onAny((eventName: Events, ...args) =>
      AppendLog(eventName, username, ...args)
    );
  };

  return (
    <WsContext.Provider value={{ wss, connect, file, connected, downloading }}>
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
