"use client";

import { message } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";

export function OsInfo() {
  const handler = async () => {
    const currentPlatform = platform();
    message(`OS: ${currentPlatform}`, { title: "Tauri", kind: "info" });
  };

  return (
    <div>
      <button type="button" onClick={handler}>
        Show Os
      </button>
    </div>
  );
}
