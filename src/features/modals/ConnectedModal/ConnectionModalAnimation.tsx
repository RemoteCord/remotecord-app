"use client";

import { TitleBar } from "@/components/common/navbar/TitleBar";
import AnimatedLightWebSocket from "./AnimatedLightWebSocket";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogConnection";
import { useWsClientContext } from "@/features/websocket/WsClient";
import { useEffect } from "react";
import { useWsApplicationProvider } from "@/features/websocket/WsApplication";

export const ConnectionModalAnimation = () => {
  const { connected, disconnect } = useWsClientContext();
  const { controllerConnection } = useWsApplicationProvider();
  useEffect(() => {
    console.log("connected", connected);
  }, [connected]);
  return (
    <Dialog open={connected}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className="w-screen h-screen bg-zinc-900 ">
        <div
          data-tauri-drag-region
          className="fixed z-[999999] flex justify-end top-0 items-center px-2 left-0 w-screen h-10 "
        >
          {/* <Image src={"/icon.png"} width={30} height={30} alt="icon" /> */}

          <TitleBar className="w-fit" />
        </div>
        <DialogHeader className="h-full">
          <DialogTitle />
          <DialogDescription />
          <div className="flex flex-col gap-24 h-full items-center justify-center">
            <div className="flex gap-4 items-center">
              <img
                src={controllerConnection.avatar}
                width={40}
                height={40}
                alt="avatar connection"
                className="rounded-full"
              />
              <p>
                <span className="font-[600]">
                  {controllerConnection.username}
                </span>
                <span> Is accessing this computer remotely</span>
              </p>
            </div>
            <AnimatedLightWebSocket />

            <DialogClose asChild onClick={disconnect}>
              <Button type="button" variant="default" size={"sm"}>
                Disconnect
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
