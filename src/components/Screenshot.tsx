"use client";

import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
import { useRef, useState } from "react";
export function Screenshot() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [screens, setScreens] = useState<any[]>([]);
  const [screen, setScreen] = useState<number | null>(null);
  const handleScreenshot = async () => {
    console.log("Taking screenshot");
    invoke("capture", { id: screen }).then((image) => {
      console.log(image);

      if (imageRef.current) {
        imageRef.current.src = `data:image/png;base64,${image}`;
      }
    });
  };

  const handleGetScreens = async () => {
    invoke("get_screens").then((screensData) => {
      const screensArray = screensData as { id: number }[];
      console.log(screens);
      setScreens(screensArray.map((screen: { id: number }) => screen.id));
    });
  };

  return (
    <div className="border p-4 flex gap-4 w-fit rounded-lg my-4">
      <button type="button" onClick={handleScreenshot}>
        Screnshot
      </button>
      <button type="button" onClick={handleGetScreens}>
        Get Screens
      </button>
      <div>
        {screens.map((screen) => (
          <button type="button" key={screen} onClick={() => setScreen(screen)}>
            {screen}
          </button>
        ))}
      </div>
      <Image ref={imageRef} width={400} height={400} src={""} alt="aaa" />
    </div>
  );
}
