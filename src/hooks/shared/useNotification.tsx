"use client";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { useEffect } from "react";

export const UseNotification = () => {
  useEffect(() => {
    const requestPermisions = async () => {
      let permissionGranted = await isPermissionGranted();

      // If not we need to request it
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }

      // Once permission has been granted we can send the notification
      if (permissionGranted) {
        // handlerPushNotification();
      }
    };

    void requestPermisions();
  }, []);

  return {
    sendNotification,
  };
};
