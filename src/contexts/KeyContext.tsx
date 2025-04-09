"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { listen, type Event } from "@tauri-apps/api/event";

type KeyEvent = Event<string>;

const KeyContext = createContext<
  | {
      keys: string[];
      setListening: (listening: boolean) => void;
    }
  | undefined
>(undefined);

const KeyContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [keys, setKeys] = useState<string[]>([]);
  const [listening, setListening] = useState<boolean>(false);

  const handlePressed = (event: KeyEvent) => {
    const { payload: key } = event;
    if (key === "␣") {
      setKeys((prev) => {
        const newKeys = [...prev, " "];
        return newKeys.length > 20 ? newKeys.slice(-20) : newKeys;
      });
    } else {
      setKeys((prev) => {
        const newKeys = [...prev, key];
        return newKeys.length > 20 ? newKeys.slice(-20) : newKeys;
      });
    }

    // console.log("keys", key);
  };

  // useEffect(() => {
  //   console.log("keys", keys);
  // }, [keys]);

  const handleReleased = () => {
    // setKey("");
  };

  useEffect(() => {
    if (listening) {
      listen("KeyPress", handlePressed);
      listen("KeyRelease", handleReleased);
    }
  }, [listening]);

  // useEffect(() => {

  //   console.log("keys", keys);
  // }, [keys]);

  return (
    <KeyContext.Provider value={{ keys, setListening }}>
      {children}
    </KeyContext.Provider>
  );
};

export const useKeyContextProvider = () => {
  const context = useContext(KeyContext);
  if (context === undefined) {
    throw new Error("bla bla");
  }

  return context;
};

export default KeyContextProvider;
