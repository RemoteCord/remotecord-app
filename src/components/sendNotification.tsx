"use client";

import { UseNotification } from "@/hooks/useNotification";

export function SendNotificationButton() {
  const { sendNotification } = UseNotification();

  return (
    <div>
      <button type="button" onClick={() => sendNotification("Hello World!")}>
        Send Notification
      </button>
    </div>
  );
}
