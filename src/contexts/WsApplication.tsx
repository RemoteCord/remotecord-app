"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useStoreTauri } from "@/hooks/useStore";
import { useWsContextProvider } from "./WsContext";
import { wsManager } from "@/client/WsClient";
import { Howl, Howler } from "howler";
import ReactHowler from "react-howler";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ConnectionModal } from "@/components/modals/ConnectionModal";
import { FriendModal } from "@/components/modals/AddFriendModal";
import { useSupabaseContextProvider } from "./SupabaseContext";
import { useSounds } from "@/hooks/use-sounds";

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

export const WsApplicationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [wssApplication, setWssApplication] = useState<Socket | null>(null);
  const { session } = useSupabaseContextProvider();
  // const {
  //   soundRequestConnection,
  //   // soundRequestConnection,
  // } = useSounds();
  const [playing, setPlaying] = useState<boolean>(false);
  const [playingJoin, setPlayingJoin] = useState<boolean>(false);

  const refSound = useRef<ReactHowler>(null);
  const refSoundJoin = useRef<ReactHowler>(null);

  // const soundRequestConnection = new Howl({
  //   src: "/sounds/call-request.mp3",
  //   html5: true,
  // });

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
      identifier: "",
    });
  const [controllerid, setControllerid] = useState<string | null>(null);

  const [tokenConnection, setTokenConnection] = useState<string | null>(null);
  const [tokenController, setTokenController] = useState<string | null>(null);

  const { getRecord } = useStoreTauri();

  const { connect, disconnect } = useWsContextProvider();

  useEffect(() => {
    console.log("session", session);
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
          identifier: string;
        }) => {
          const { controllerid, controller, tokenConnection, identifier } =
            data;
          console.log("emitConnectToController", data);

          getRecord<boolean>("autoaccept").then((autoaccept) => {
            console.log("autoaccept", autoaccept);

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
              return;
            }

            setOpenModal(true);

            // if (token) {
            //   connect(token);
            // } else {
            //   console.error(
            //     "No controllerid token provided in emitConnectToController event"
            //   );
            // }
          });
        }
      );
    };

    if (session) connectWsApplication();
  }, [session]);

  const handleAcceptConnection = () => {
    if (tokenConnection && controllerConnection) {
      connect(
        controllerConnection.controllerid,
        tokenConnection,
        controllerConnection.username,
        controllerConnection.identifier
      );
      setControllerData({
        username: "",
        avatar: "",
        token: "",
      });

      setTimeout(() => {
        setPlayingJoin(true);
        refSoundJoin.current?.seek(0);
        refSoundJoin.current?.howler.volume(1);
        refSoundJoin.current?.howler.play();

        setTimeout(() => {
          refSoundJoin.current?.howler.stop();
          refSoundJoin.current?.seek(0);
          setPlayingJoin(false);
        }, 1000);
      }, 400);
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

  useEffect(() => {
    console.log("openModal", openModal, "playing", playing); // Add playing to debug log
    if (openModal) {
      refSound.current?.seek(0);
      refSound.current?.howler.volume(1);
      refSound.current?.howler.play();
      setPlaying(true);
    } else {
      if (playing) {
        // refSoundJoin.current?.howler.play();
        refSound.current?.howler.fade(1, 0, 500);

        setTimeout(() => {
          refSound.current?.howler.stop();
          refSound.current?.seek(0);
          setPlaying(false);
        }, 500);
      }
    }
  }, [openModal]);

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
      <div className="absolute">
        <ReactHowler
          // playing={playing}
          // playing={playing}
          playing={playing}
          ref={refSound}
          src={["/sounds/call-request.mp3"]}
          html5={true}
        />
        <ReactHowler
          // playing={playing}
          // playing={playing}
          playing={playingJoin}
          ref={refSoundJoin}
          src={["/sounds/call-join.mp3"]}
          html5={true}
        />
      </div>

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
