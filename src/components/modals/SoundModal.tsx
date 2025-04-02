"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { Slider } from "@/components/ui/slider";
import { DialogFooter } from "../ui/dialogConnection";
import { useStoreTauri } from "@/hooks/useStore";

export const SoundModal = ({}: {}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { getRecord, insertRecord } = useStoreTauri();
  const [selectConnect, setSelectConnect] = useState<number>(100);
  const [selectAccept, setSelectAccept] = useState<number>(100);
  const [selectDisconnect, setSelectDisconnect] = useState<number>(100);

  useEffect(() => {
    const getSoundConfig = async () => {
      const sounds = await getRecord<
        | {
            connect: number;
            accept: number;
            disconnect: number;
          }
        | undefined
      >("sounds");

      if (!sounds) {
        await insertRecord("sounds", {
          connect: 100,
          accept: 100,
          disconnect: 100,
        });
        return;
      }

      setSelectConnect(sounds.connect);
      setSelectAccept(sounds.accept);
      setSelectDisconnect(sounds.disconnect);

      console.log("sounds", sounds);

      // setSelectConnect(connect);
      // setSelectAccept(accept);
      // setSelectDisconnect(disconnect);
    };

    getSoundConfig();
  }, []);

  const handleSaveSoundConfig = async () => {
    await insertRecord("sounds", {
      connect: selectConnect,
      accept: selectAccept,
      disconnect: selectDisconnect,
    });
    setOpenModal(false);
  };
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <button
          className="button_style w-full py-2 rounded-lg"
          onClick={() => setOpenModal(true)}
        >
          Open sound config
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="flex gap-4 items-center">
            <span>Sound config</span>
          </DialogTitle>
          <DialogDescription className="flex gap-8">
            <div className="">
              <div className="grid grid-cols-[1fr_250px_25px] gap-4">
                <p>Connection Sound</p>
                <Slider
                  max={100}
                  step={1}
                  value={[selectConnect]}
                  className=""
                  onValueChange={(values) => setSelectConnect(values[0])}
                />
                <p className="font-[600] text-white">{selectConnect}%</p>
              </div>
              <div className="grid grid-cols-[1fr_250px_25px] gap-4">
                <p>Accept request</p>
                <Slider
                  max={100}
                  value={[selectAccept]}
                  step={1}
                  className=""
                  onValueChange={(values) => setSelectAccept(values[0])}
                />
                <p className="font-[600] text-white">{selectAccept}%</p>
              </div>
              <div className="grid grid-cols-[1fr_250px_25px] gap-4">
                <p>Disconnect client</p>
                <Slider
                  max={100}
                  value={[selectDisconnect]}
                  step={1}
                  className=""
                  onValueChange={(values) => setSelectDisconnect(values[0])}
                />
                <p className="font-[600] text-white">{selectDisconnect}%</p>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <button
              className="button_style px-4 py-2 rounded-lg "
              onClick={handleSaveSoundConfig}
            >
              Save
            </button>
            <DialogClose asChild>
              <button
                className="button_style px-4 py-2 rounded-lg "
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
