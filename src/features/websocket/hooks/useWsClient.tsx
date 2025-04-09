"use client";

import type { WsService } from "../ws.service";
import { download } from "@tauri-apps/plugin-upload";
import { useState } from "react";
import { useStoreTauri } from "@/hooks/common/useStore";
// import { useLogContextProvider } from "@/contexts/LogContext";
import type { Events } from "@/features/websocket/WsClient";
import type { Socket } from "socket.io-client";
import { useLogContextProvider } from "@/contexts/LogContext";

export const useWsClient = () => {
  const [wsService, setWsService] = useState<WsService>();
  const { getRecord } = useStoreTauri();
  const [downloading, setDownloading] = useState<boolean>(false);
  const { appendLog } = useLogContextProvider();

  const [file, setFile] = useState<{
    progress: number;
    total: number;
    filename: string;
  }>({
    progress: 0,
    total: 0,
    filename: "",
  });
  // const { appendLog } = useLogContextProvider();

  const AppendLog = (
    eventName: Events,
    username: string,
    ...args: unknown[]
  ) => {
    console.log("onAny", eventName, args);
    appendLog({
      type: eventName,
      controller: username,
      context: "",
    });
  };

  const UploadFile = async (data: WS.UploadFile, socket: Socket) => {
    const { fileroute } = data;
    console.log("uploadFile", data);
    let progressDownload = 0;
    const filename = fileroute
      .split("/")
      .filter((route) => route.includes("?"))[0]
      .split("?")[0];

    const savedDownloadPath = `${
      (await getRecord("downloadFolder")) as string
    }\\${filename}`;

    console.log("savedDownloadPath", savedDownloadPath);
    if (!savedDownloadPath) return;
    download(fileroute, savedDownloadPath, ({ progress, total }) => {
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
        socket.emit("message", {
          message: "File downloaded",
          editReply: true,
        });
      }
    });
  };

  return { setWsService, file, downloading, UploadFile, AppendLog };
};
