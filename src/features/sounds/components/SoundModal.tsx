"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { Slider } from "@/components/ui/slider";
import { DialogFooter } from "@/components/ui/dialogConnection";
import { useVolumes } from "../hooks/useVolumes";

export const SoundModal = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { volumes, updateVolume } = useVolumes();

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="button_style w-full py-2 rounded-lg"
          onClick={() => setOpenModal(true)}
        >
          Open sound config
        </button>
      </DialogTrigger>
      <DialogContent className="w-[600px] ">
        <DialogHeader className="flex flex-col gap-4 mb-8">
          <DialogTitle className="flex gap-4 items-center">
            <span>Sound config</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Adjust the volume of the different sounds
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-w-[90%] mx-auto ">
          <div className="grid grid-cols-[1fr_250px_25px] gap-4">
            <p>Connection Sound</p>
            <Slider
              max={100}
              step={1}
              value={[volumes.callRequest]}
              className=""
              onValueChange={(values) => updateVolume("callRequest", values[0])}
            />
            <p className="font-[600] text-center text-white">
              {volumes.callRequest}%
            </p>
          </div>
          <div className="grid grid-cols-[1fr_250px_25px] gap-4">
            <p>Accept request</p>
            <Slider
              max={100}
              value={[volumes.callJoin]}
              step={1}
              className=""
              onValueChange={(values) => updateVolume("callJoin", values[0])}
            />
            <p className="font-[600] text-white">{volumes.callJoin}%</p>
          </div>
          <div className="grid grid-cols-[1fr_250px_25px] gap-4">
            <p>Command recive sound</p>
            <Slider
              max={100}
              value={[volumes.commandRecived]}
              step={1}
              className=""
              onValueChange={(values) =>
                updateVolume("commandRecived", values[0])
              }
            />
            <p className="font-[600] text-white">{volumes.commandRecived}%</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className="button_style px-4 py-2 rounded-lg "
              onClick={() => setOpenModal(false)}
            >
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
