"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useStoreTauri } from "@/hooks/useStore";
import { useWsContextProvider } from "./WsContext";
import { wsManager } from "@/client/WsClient";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ConnectionModal } from "@/components/modals/ConnectionModal";
import { FriendModal } from "@/components/modals/AddFriendModal";

interface ControllerConnectionType {
  username: string;
  avatar: string;
  controllerid: string;
}

const WsApplicationContext = createContext<
  | {
      controllerConnection: ControllerConnectionType;
    }
  | undefined
>(undefined);

export const WsApplicationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [wssApplication, setWssApplication] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalFriend, setOpenModalFriend] = useState<boolean>(false);

  const [controllerData, setControllerData] = useState<{
    username: string;
    avatar: string;
    token: string;
  }>({
    username: "",
    avatar: "",
    token: "",
  });

  const [controllerConnection, setControllerConnection] =
    useState<ControllerConnectionType>({
      username: "",
      avatar: "",
      controllerid: "",
    });
  const [controllerid, setControllerid] = useState<string | null>(null);

  const [tokenConnection, setTokenConnection] = useState<string | null>(null);
  const [tokenController, setTokenController] = useState<string | null>(null);

  const { getRecord } = useStoreTauri();

  const { connect, disconnect } = useWsContextProvider();

  useEffect(() => {
    const connectWsApplication = async () => {
      console.log("Connecting to ws application");

      const auth = (await getRecord("auth")) as {
        token: string;
      };
      if (!auth) return;
      const { token } = auth;

      console.log("authtoken", token);

      const socket = wsManager.socket(`/application`, {
        auth: {
          token,
        },
      });

      socket.on("connect", () => {
        console.log("Connected to ws application");
        setWssApplication(socket);
        toast({
          title: "Connected to application",
          description: "You are now connected to the application",
        });
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from ws application");
        setWssApplication(null);
      });

      socket.on("error", (error) => {
        console.log("Error", error);
      });

      socket.on(
        "addFriend",
        (data: {
          clientid: string;
          username: string;
          avatar: string;
          controllerid: string;
          token: string;
        }) => {
          const { clientid, username, avatar, controllerid, token } = data;
          console.log("addFriend", data);
          setControllerid(controllerid);
          setControllerData({
            username,
            avatar,
            token,
          });
          setOpenModalFriend(true);
        }
      );

      socket.removeAllListeners("emitConnectToController");
      socket.on(
        "emitConnectToController",
        (data: {
          controller: {
            username: string;
            avatar: string;
          };
          controllerid: string;
          tokenConnection: string;
        }) => {
          const { controllerid, controller, tokenConnection } = data;
          console.log("emitConnectToController", data);
          setControllerConnection({
            ...controller,
            controllerid,
          });
          setOpenModal(true);
          setTokenConnection(tokenConnection);
          setTokenController(token);
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
    if (tokenConnection && controllerConnection) {
      connect(
        controllerConnection.controllerid,
        tokenConnection,
        controllerData.username
      );
      setOpenModal(false);
      setControllerData({
        username: "",
        avatar: "",
        token: "",
      });
    } else {
      setOpenModal(false);

      console.error(
        "No controllerid token provided in emitConnectToController"
      );
    }
  };

  const handleAcceptFriend = () => {
    // connect(tokenConnection, controllerData.username);
    setOpenModalFriend(false);

    wssApplication?.emit("addFriend", {
      controllerid: controllerid,
      token: controllerData.token,
    });

    setControllerData({
      username: "",
      avatar: "",
      token: "",
    });
  };

  return (
    <WsApplicationContext.Provider value={{ controllerConnection }}>
      <FriendModal
        openModal={openModalFriend}
        controllerData={controllerData}
        handleAcceptFriend={handleAcceptFriend}
        setOpenModal={setOpenModalFriend}
      />

      <ConnectionModal
        openModal={openModal}
        controllerData={controllerConnection}
        handleAcceptConnection={handleAcceptConnection}
        setOpenModal={setOpenModal}
      />
      {children}
    </WsApplicationContext.Provider>
  );
};

export const useWsApplicationProvider = () => {
  const context = useContext(WsApplicationContext);
  if (context === undefined) {
    throw new Error("Eres tontito o que?");
  }

  return context;
};
