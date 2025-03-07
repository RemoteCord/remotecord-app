"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useStoreTauri } from "@/hooks/shared/useStore";
import { useWsContextProvider } from "./WsContext";
import { wsManager } from "@/client/WsClient";

const WsApplicationContext = createContext<
  | {
      wssApplication: Socket | null;
      connected: boolean;
    }
  | undefined
>(undefined);

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const WsApplicationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [wssApplication, setWssApplication] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [controllerData, setControllerData] = useState<{
    username: string;
    avatar: string;
  }>({
    username: "",
    avatar: "",
  });
  const [tokenConnection, setTokenConnection] = useState<string | null>(null);

  const { getRecord } = useStoreTauri();

  const { connect } = useWsContextProvider();

  useEffect(() => {
    const connectWsApplication = async () => {
      console.log("Connecting to ws application");

      const { token } = (await getRecord("auth")) as {
        token: string;
      };
      console.log("authtoken", token);

      const socket = wsManager.socket(`/application`, {
        auth: {
          token,
        },
      });

      socket.on("connect", () => {
        console.log("Connected to ws application");
        setWssApplication(socket);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from ws application");
        setWssApplication(null);
      });

      socket.on("error", (error) => {
        console.log("Error", error);
      });

      socket.removeAllListeners("emitConnectToController");
      socket.on(
        "emitConnectToController",
        (data: {
          token: string;
          controller: {
            username: string;
            avatar: string;
          };
        }) => {
          const { token, controller } = data;
          console.log("emitConnectToController", data);
          setControllerData(controller);
          setOpenModal(true);
          setTokenConnection(token);
          // if (token) {
          //   connect(token);
          // } else {
          //   console.error(
          //     "No controllerid token provided in emitConnectToController event"
          //   );
          // }
        }
      );
    };

    connectWsApplication();
  }, []);

  const handleAcceptConnection = () => {
    if (tokenConnection) {
      connect(tokenConnection, controllerData.username);
      setOpenModal(false);
    } else {
      console.error(
        "No controllerid token provided in emitConnectToController"
      );
    }
  };

  return (
    <WsApplicationContext.Provider value={{ wssApplication, connected }}>
      <Dialog open={openModal}>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle className="flex gap-4 items-center">
              <span>
                {controllerData?.avatar && (
                  <Image
                    src={controllerData?.avatar}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}
              </span>
              {controllerData?.username} wants to connect
            </DialogTitle>
            <DialogDescription className="flex gap-8">
              <Button onClick={handleAcceptConnection}>Accept</Button>

              <Button
                variant={"destructive"}
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {children}
    </WsApplicationContext.Provider>
  );
};

export const useWsApplicationContextProvider = () => {
  const context = useContext(WsApplicationContext);
  if (context === undefined) {
    throw new Error(
      "WsApplicationContextProvider must be used within a WsApplicationContextProvider"
    );
  }

  return context;
};

export default WsApplicationContextProvider;
