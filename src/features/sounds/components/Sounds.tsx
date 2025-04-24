import { useSoundsStore } from "@/stores/sounds.store";
import { useEffect, useRef, useState } from "react";
import ReactHowler from "react-howler";
import { useVolumes } from "../hooks/useVolumes";

export const Sounds = () => {
  const {
    callJoinPlay,
    callRequestPlay,
    commandRecivedPlay,
    setCallJoinPlay,
    setCallRequestPlay,
    setCommandRecivedPlay,
  } = useSoundsStore((state) => state);
  const [playRequest, setPlayRequest] = useState(false);
  const [playJoin, setPlayingJoin] = useState(false);
  const [playMessageSound, setPlayMessageSound] = useState(false);
  const { volumes } = useVolumes();
  const refSoundRequest = useRef<ReactHowler>(null);
  const refSoundJoin = useRef<ReactHowler>(null);
  const refSoundMessageRecived = useRef<ReactHowler>(null);

  useEffect(() => {
    console.log("volumes sound component", volumes);
    refSoundRequest.current?.howler.volume(volumes.callRequest);
    refSoundJoin.current?.howler.volume(volumes.callJoin);
    refSoundMessageRecived.current?.howler.volume(volumes.commandRecived);
  }, [volumes]);

  useEffect(() => {
    console.log("callRequest", callRequestPlay);
    if (callRequestPlay) {
      refSoundRequest.current?.seek(0);
      refSoundRequest.current?.howler.volume(1);
      refSoundRequest.current?.howler.play();
      setPlayRequest(true);
    } else {
      refSoundRequest.current?.howler.fade(1, 0, 500);

      setTimeout(() => {
        refSoundRequest.current?.howler.stop();
        refSoundRequest.current?.seek(0);
        setPlayRequest(false);
      }, 500);
    }
  }, [callRequestPlay]);

  useEffect(() => {
    console.log("callJoin", callJoinPlay);
    if (callJoinPlay) {
      setTimeout(() => {
        setPlayingJoin(true);
        refSoundJoin.current?.seek(0);
        refSoundJoin.current?.howler.play();

        refSoundJoin.current?.howler.on("end", () => {
          refSoundJoin.current?.howler.stop();
          refSoundJoin.current?.seek(0);
          setPlayingJoin(false);
          setCallJoinPlay(false);
        });
      }, 400);
    }
  }, [callJoinPlay]);

  useEffect(() => {
    console.log("command recived play", commandRecivedPlay);
    if (commandRecivedPlay) {
      refSoundMessageRecived.current?.seek(0);
      refSoundMessageRecived.current?.howler.play();

      refSoundMessageRecived.current?.howler.on("end", () => {
        refSoundMessageRecived.current?.howler.stop();
        refSoundMessageRecived.current?.seek(0);
        setPlayMessageSound(false);
        setCommandRecivedPlay(false);
      });
    }
  }, [commandRecivedPlay]);

  return (
    <>
      <ReactHowler
        playing={playRequest}
        ref={refSoundRequest}
        src={["/sounds/call-request.mp3"]}
        html5={true}
      />
      <ReactHowler
        playing={playJoin}
        ref={refSoundJoin}
        src={["/sounds/call-join.mp3"]}
        html5={true}
      />
      <ReactHowler
        playing={playMessageSound}
        ref={refSoundMessageRecived}
        src={["/sounds/message-sound.mp3"]}
        html5={true}
      />
    </>
  );
};
