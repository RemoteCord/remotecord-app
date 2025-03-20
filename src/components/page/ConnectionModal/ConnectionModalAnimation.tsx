"use client";

import { TitleBar } from "@/components/navbar/TitleBar";
import AnimatedLightWebSocket from "@/components/ui/AnimatedLightWebSocket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogConnection";

export const ConnectionModalAnimation = () => {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="w-screen h-screen bg-zinc-900 ">
        <div
          data-tauri-drag-region
          className="fixed z-[999999] flex justify-end top-0 items-center px-2 left-0 w-screen h-10 "
        >
          <TitleBar className="w-fit" />
        </div>
        <DialogHeader className="h-fit">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col">
              <AnimatedLightWebSocket />
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
