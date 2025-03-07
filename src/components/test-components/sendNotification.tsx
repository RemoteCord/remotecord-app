"use client";

import { UseNotification } from "@/hooks/shared/useNotification";

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
