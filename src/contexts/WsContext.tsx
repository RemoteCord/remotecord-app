"use client";

// import WebSocket from "@tauri-apps/plugin-websocket";
import { createContext, useContext, useState } from "react";
// import io from "socket.io-client";
import { io, type Socket } from "socket.io-client";

import WebSocket from "@tauri-apps/plugin-websocket";
import { useStoreTauri } from "@/hooks/useStore";
import { ClientService, Folders } from "@/services/client";
import HttpClient from "@/client/HttpClient";
import { useApi } from "@/hooks/useApi";

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
  const { request } = useApi();

  const connect = async () => {
    console.log("Connecting");

    const authtoken = await getRecord("auth");
    console.log("authtoken", authtoken);

    const socket = io(
      `wss://preview.luqueee.dev/controllers?token=${authtoken}&controller=546000599267672074`,
      {
        reconnectionDelayMax: 10000,
      }
    );

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

    socket.on(
      "getFilesFolder",
      async (message: { folder: Folders; relativepath: string }) => {
        try {
          const { folder, relativepath } = message;
          console.log("getFileFromClient", message);
          // const { buffer, metadata } = await ClientService.getFileFromClient(
          //   fileroute
          // );

          const { files, relativePathResult } =
            await ClientService.getFilesFromFolder(folder, relativepath);

          // console.log("getFileFromClient", buffer, metadata);

          socket.emit("getFilesFolder", {
            files,
            folder,
            relativepath: relativePathResult,
          });
        } catch (error) {}
      }
    );

    socket.on("getFileFromClient", async (message: { fileroute: string }) => {
      try {
        console.log("getFileFromClient", message);
        const { fileroute } = message;
        const { buffer, metadata } = await ClientService.getFileFromClient(
          fileroute
        );

        console.log("getFileFromClient", buffer, metadata);

        socket.emit("getFileFromClient", {
          buffer,
          metadata,
        });

        // const formData = new FormData();
        // const blob = new Blob([buffer], { type: "application/octet-stream" });

        // // Add the file to FormData
        // formData.append("file", blob, metadata.filename);
        // // Add metadata as additional fields
        // formData.append("metadata", JSON.stringify(metadata));

        // const res = await request({
        //   method: "POST",
        //   headers: {
        //     // Don't set Content-Type here, it will be automatically set with boundary
        //   },
        //   url: "/client/files/upload",
        //   data: formData,
        // });

        // const responseData = await res.json();
        // console.log("Upload response:", responseData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("getFileFromClient error", errorMessage);
      }
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
