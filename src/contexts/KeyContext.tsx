"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { listen, type Event } from "@tauri-apps/api/event";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { KeyloggerService } from "@/services/client";

type KeyEvent = Event<string>;

const KeyContext = createContext<
  | {
      key: string;
    }
  | undefined
>(undefined);

const KeyContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [key, setKey] = useState<string>("");

  useEffect(() => {
    const keyLogger = new KeyloggerService();

    const handlePressed = (event: KeyEvent) => {
      const { payload: key } = event;
      setKey(key);
      // console.log("key", key);
      keyLogger.keyPress(event);
    };

    const handleReleased = () => {
      setKey("");
    };

    void onOpenUrl((urls) => {
      console.log("deep link:", urls);
    });

    listen("KeyPress", handlePressed);
    listen("KeyRelease", handleReleased);
  }, []);

  // useEffect(() => {
  //   console.log(key);
  // }, [key]);

  return <KeyContext.Provider value={{ key }}>{children}</KeyContext.Provider>;
};

export const useKeyContextProvider = () => {
  const context = useContext(KeyContext);
  if (context === undefined) {
    throw new Error("bla bla");
  }

  return context;
};

export default KeyContextProvider;
