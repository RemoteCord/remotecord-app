import { FriendModal } from "@/features/modals/AddFriendModal";
import { ConnectionModal } from "@/features/modals/ConnectionModal";
import { useNotification, useStoreTauri } from "@/hooks/common";
import { env } from "@/shared/env.config";
import { createContext, useContext, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";
import { toast } from "sonner";
import { useFriends } from "../friends/hooks/useFriends";
import { useSession } from "@/hooks/authentication";
import { useSoundsStore } from "@/stores/sounds.store";

interface ControllerConnectionType {
  username: string;
  avatar: string;
  controllerid: string;
  identifier: string;
}

const WsApplicationContext = createContext<
  | {
      controllerConnection: ControllerConnectionType;
    }
  | undefined
>(undefined);
export const WsApplication: React.FC<{
  connect: (
    controllerid: string,
    tokenConnection: string,
    username: string,
    identifier: string
  ) => Promise<void>;
  children: React.ReactNode;
}> = ({ connect, children }) => {
  const [wssApplication, setWssApplication] = useState<Socket | null>(null);
  const { getRecord } = useStoreTauri();
  const { token, isLoading } = useSession();
  const { getFriends } = useFriends();
  // const { sendMessage } = useNotification();
  const { setCallRequestPlay, setCallJoinPlay } = useSoundsStore(
    (state) => state
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalFriend, setOpenModalFriend] = useState<boolean>(false);

  const [controllerData, setControllerData] = useState<{
    username: string;
    picture: string;
    token: string;
  }>({
    username: "",
    picture: "",
    token: "",
  });

  const [controllerConnection, setControllerConnection] =
    useState<ControllerConnectionType>({
      username: "",
      avatar: "",
      controllerid: "",
      identifier: "",
    });
  const [controllerid, setControllerid] = useState<string | null>(null);

  const [tokenConnection, setTokenConnection] = useState<string | null>(null);
  const [tokenController, setTokenController] = useState<string | null>(null);

  useEffect(() => {
    const connectWsApplication = async () => {
      console.log("Connecting to ws application");

      console.log("authtoken", token);

      const socket = io(`${env.VITE_API_URL}/application`, {
        // path: "/api/socket.io",
        transports: ["websocket"],
        auth: {
          token,
        },
      });

      socket.on("connect", () => {
        console.log("Connected to ws application");
        setWssApplication(socket);
        toast("Connected to application");
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
          picture: string;
          controllerid: string;
          token: string;
        }) => {
          const { clientid, username, picture, controllerid, token } = data;
          console.log("addFriend", data);
          setControllerid(controllerid);
          setControllerData({
            username,
            picture,
            token,
          });
          setOpenModalFriend(true);
        }
      );

      socket.removeAllListeners("emitConnectToController");
      socket.on(
        "emitConnectToController",
        async (data: {
          controller: {
            username: string;
            avatar: string;
          };
          controllerid: string;
          tokenConnection: string;
          identifier: string;
        }) => {
          const { controllerid, controller, tokenConnection, identifier } =
            data;
          console.log("emitConnectToController", data);
          const autoaccept = await getRecord<boolean>("autoaccept");
          setControllerConnection({
            ...controller,
            controllerid,
            identifier,
          });
          setTokenConnection(tokenConnection);
          setTokenController(token);

          if (autoaccept) {
            connect(
              controllerid,
              tokenConnection,
              controller.username,
              identifier
            );

            setCallJoinPlay(true);

            return;
          }
          setCallRequestPlay(true);
          setOpenModal(true);
          // sendMessage(
          //   "Connection",
          //   `You have a new connection request from ${controller.username}`
          // );
        }
      );
    };

    if (!isLoading) void connectWsApplication();
  }, [isLoading]);

  const handleAcceptFriend = (accept: boolean) => {
    // connect(tokenConnection, controllerData.username);
    setOpenModalFriend(false);

    wssApplication?.emit("addFriend", {
      controllerid: controllerid,
      token: controllerData.token,
      accept,
    });

    setTimeout(async () => {
      await getFriends();
    }, 1000);

    setControllerData({
      username: "",
      picture: "",
      token: "",
    });
  };

  const handleAcceptConnection = (value = true) => {
    if (!value) {
      setCallRequestPlay(false);
      setOpenModal(false);
      return;
    }

    if (tokenConnection && controllerConnection) {
      connect(
        controllerConnection.controllerid,
        tokenConnection,
        controllerConnection.username,
        controllerConnection.identifier
      );
      setControllerData({
        username: "",
        picture: "",
        token: "",
      });

      setCallRequestPlay(false);
      setCallJoinPlay(true);

      // setTimeout(() => {
      //   setPlayingJoin(true);
      //   refSoundJoin.current?.seek(0);
      //   refSoundJoin.current?.howler.volume(1);
      //   refSoundJoin.current?.howler.play();

      //   setTimeout(() => {
      //     refSoundJoin.current?.howler.stop();
      //     refSoundJoin.current?.seek(0);
      //     setPlayingJoin(false);
      //   }, 1000);
      // }, 400);
    } else {
      console.error(
        "No controllerid token provided in emitConnectToController"
      );
    }
    setOpenModal(false);

    // soundRequestConnection.fade(1, 0, 1000).on("fade", () => {
    //   console.log("fade");
    //   soundRequestConnection.stop();
    // });
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
