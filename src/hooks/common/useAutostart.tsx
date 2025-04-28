import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import { useEffect, useState } from "react";

export const useAutostart = () => {
  const [isAutostartEnabled, setAutostartEnabled] = useState(false);

  useEffect(() => {
    const checkAutostart = async () => {
      const isEnabledAutostart = await isEnabled();
      console.log("Autostart enabled:", isEnabledAutostart);

      setAutostartEnabled(isEnabledAutostart);
    };
    checkAutostart();
  }, []);

  const toggleAutostart = async (value: boolean) => {
    if (value) {
      await enable();
      setAutostartEnabled(true);
    } else {
      await disable();
      setAutostartEnabled(false);
    }

    console.log("Autostart toggle to:", value);
  };

  return {
    isAutostartEnabled,
    toggleAutostart,
  };
};
