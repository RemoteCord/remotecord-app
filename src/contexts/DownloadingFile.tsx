"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useStoreTauri } from "@/hooks/shared/useStore";
import { useWsContextProvider } from "./WsContext";
import { wsManager } from "@/client/WsClient";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const DownloadingFile: React.FC<{}> = () => {
  const { downloading, file } = useWsContextProvider();
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <Dialog open={downloading}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="flex gap-4 items-center">
            Downloading... {file.filename}
          </DialogTitle>
          <DialogDescription className="flex gap-8">
            {/* <Button onClick={handleAcceptConnection}>Accept</Button> */}
            <Progress
              value={file.progress}
              total={file.total}
              key={file.progress}
            />
            {/* <Button variant={"destructive"} onClick={() => setOpenModal(false)}>
              Cancel
            </Button> */}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
