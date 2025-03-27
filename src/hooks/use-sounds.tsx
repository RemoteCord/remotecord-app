"use client";
import { useState } from "react";
import useSound from "use-sound";
import { Howl, Howler } from "howler";
export const useSounds = () => {
  const [volumeSound, setVolumeSound] = useState(0.5);

  const soundRequestConnection = new Howl({ src: "/sounds/call-request.mp3" });

  return {
    soundRequestConnection,
  };
};
