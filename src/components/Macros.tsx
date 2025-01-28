"use client";

import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
import { useRef, useState } from "react";
export function Macros() {
  const [macro, setMacro] = useState<any[]>([]);

  const imageRef = useRef<HTMLImageElement>(null);
  const start_marcro = async () => {
    console.log("start recording");
    invoke("start_recording").then((res) => {
      console.log("res", res);
    });
  };

  const stop_macro = async () => {
    console.log("stop recording");
    invoke("stop_recording").then((res) => {
      console.log("res", res);
      setMacro(res as any[]);
    });
  };

  const play_macro = async () => {
    console.log("play macro");
    invoke("play_macro", { macroEvents: macro }).then((res) => {
      console.log("res", res);
    });
  };

  return (
    <div className="border p-4 flex gap-4 w-fit rounded-lg my-4">
      <button type="button" onClick={start_marcro}>
        Start Macro
      </button>
      <button type="button" onClick={stop_macro}>
        Stop Macro
      </button>
      <button type="button" onClick={play_macro}>
        Play Macro
      </button>
    </div>
  );
}
