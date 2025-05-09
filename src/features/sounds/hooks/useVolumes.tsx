import { volumesStore } from "@/services";
import { useSoundsStore } from "@/stores/sounds.store";
import { useEffect } from "react";

export interface Volumes {
  callJoin: number;
  callRequest: number;
  commandRecived: number;
}

export const useVolumes = () => {
  const { volumes, setVolumes } = useSoundsStore((state) => state);

  useEffect(() => {
    volumesStore
      .getRecord("volumes")
      .then((volumes) => {
        if (volumes) {
          setVolumes(volumes as Volumes);
        } else {
          volumesStore.insertRecord("volumes", {
            callJoin: 100,
            callRequest: 100,
            commandRecived: 100,
          });
          setVolumes({
            callJoin: 100,
            callRequest: 100,
            commandRecived: 100,
          });
        }
      })
      .catch(async () => {
        volumesStore.insertRecord("volumes", {
          callJoin: 100,
          callRequest: 100,
          commandRecived: 100,
        });
        setVolumes({
          callJoin: 100,
          callRequest: 100,
          commandRecived: 100,
        });
      });
  }, []);

  const updateVolume = async (key: keyof Volumes, value: number) => {
    setVolumes({ ...volumes, [key]: value });
  };

  useEffect(() => {
    console.log("volumes", volumes);
    volumesStore.insertRecord("volumes", volumes);
  }, [volumes]);

  return { volumes, updateVolume };
};
