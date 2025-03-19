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
      connect: (
        controllerid: string,
        tokenConnection: string,
        username: string
      ) => Promise<void>;
      disconnect: () => void;
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

  const disconnect = () => {
    console.log("Disconnecting from ws-client", wss);
    if (wss) {
      console.log("Disconnecting from ws-client", wss);
      wss.disconnect();
      setWss(null);
      setConnected(false);
    } else {
      console.log("No WebSocket connection to disconnect");
    }
  };

  const connect = async (
    controllerid: string,
    tokenConnection: string,
    username: string
  ) => {
    if (!controllerid) {
      console.error("No controllerid id provided to connect function");
      return;
    }

    const { token } = (await getRecord("auth")) as {
      token: string;
    };
    console.log("authtoken", token);

    console.log("Connecting to ws-client", controllerid, token);
    const socket = io(`${env.NEXT_PUBLIC_WS_URL}/clients`, {
      query: {
        controllerid,
      },
      auth: {
        token,
        tokenConnection,
      },
    });

    setWss(socket);

    const wsService = new WsService(socket);
    setWsService(wsService);

    socket.on("connect", () => {
      console.log("Connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setWss(null);
    });

    socket.on(
      "emitDisconnectFromController",
      (data: { controllerid: string }) => {
        console.log("emitDisconnectFromController", data);
        socket.disconnect();
      }
    );

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
    <WsContext.Provider
      value={{ wss, connect, disconnect, file, connected, downloading }}
    >
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
