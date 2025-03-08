"use client";

import { createContext, useContext, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useStoreTauri } from "@/hooks/shared/useStore";
import { WsService } from "@/services/client";
import { useSupabaseContextProvider } from "./SupabaseContext";
import { useLogContextProvider } from "./LogContext";
import { download } from "@tauri-apps/plugin-upload";
import { useToast } from "@/hooks/shared/use-toast";

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
  const [wss, setWss] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { appendLog } = useLogContextProvider();
  const { getRecord } = useStoreTauri();
  const [downloading, setDownloading] = useState<boolean>(false);
  const [file, setFile] = useState<{
    progress: number;
    total: number;
    filename: string;
  }>({
    progress: 0,
    total: 0,
    filename: "",
  });

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

    socket.on("uploadFile", (data: WS.UploadFile) => {
      const { fileroute } = data;
      console.log("uploadFile", data);
      let progressDownload = 0;
      const filename = fileroute
        .split("/")
        .filter((route) => route.includes("?"))[0]
        .split("?")[0];
      const downloadPath = `C:/Users/luque/Desktop/${filename}`;

      download(fileroute, downloadPath, ({ progress, total }) => {
        if (progressDownload === 0) setDownloading(true);
        progressDownload += progress;
        console.log(
          `Downloaded ${progress} ${progressDownload} of ${total} bytes`
        );
        setFile({
          progress: progressDownload,
          total,
          filename,
        });

        if (progressDownload === total) {
          setDownloading(false);
        }
      });
    });

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
