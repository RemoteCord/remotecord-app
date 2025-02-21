"use client";

import { UseNotification } from "@/hooks/useNotification";
import { fetch } from "@tauri-apps/plugin-http";

export function SendRequest() {
  const handleReq = () => {
    fetch("https://preview.luqueee.dev")
      .then(async (res) => await res.json())
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div>
      <button type="button" onClick={() => handleReq()}>
        Send req
      </button>
    </div>
  );
}
