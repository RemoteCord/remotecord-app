import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { useEffect, useState } from "react";
export const useNotification = () => {
  const [permission, setPermission] = useState(false);

  const checkPermissions = async () => {
    let permissionGranted = await isPermissionGranted();

    // Si no es así, necesitamos solicitarlo
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
      setPermission(permissionGranted);
    }
  };

  useEffect(() => {
    void checkPermissions;
  }, []);

  const sendMessage = async (title: string, body: string) => {
    let permissionGranted = await isPermissionGranted();

    // Si no es así, necesitamos solicitarlo
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }

    console.log("permissionGranted", permissionGranted);

    if (permissionGranted) {
      sendNotification({
        title,
        body,
      });
    }
  };

  return {
    sendMessage,
  };
};
