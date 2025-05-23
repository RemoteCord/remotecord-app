import { useSoundsStore } from "@/stores/sounds.store";
import { useEffect, useRef, useState } from "react";
import ReactHowler from "react-howler";

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
  const { volumes } = useSoundsStore((state) => state);
  const refSoundRequest = useRef<ReactHowler>(null);
  const refSoundJoin = useRef<ReactHowler>(null);
  const refSoundMessageRecived = useRef<ReactHowler>(null);

  useEffect(() => {
    console.log("callRequest", callRequestPlay);
    if (callRequestPlay) {
      refSoundRequest.current?.seek(0);
      refSoundRequest.current?.howler.play();
      refSoundRequest.current?.howler.volume(volumes.callRequest / 100);

      refSoundRequest.current?.howler.on("play", () => {
        console.log("play", volumes.callRequest);
      });
      refSoundRequest.current?.howler.on("end", () => {
        refSoundRequest.current?.howler.stop();
        refSoundRequest.current?.seek(0);
        setPlayRequest(false);
      });
    } else {
      refSoundRequest.current?.howler.fade(1, 0, 500);

      setTimeout(() => {
        refSoundRequest.current?.howler.stop();
        refSoundRequest.current?.seek(0);
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
        volume={volumes.callRequest / 100}
        src={["/sounds/call-request.mp3"]}
        html5={true}
      />
      <ReactHowler
        playing={playJoin}
        ref={refSoundJoin}
        volume={volumes.callJoin / 100}
        src={["/sounds/call-join.mp3"]}
        html5={true}
      />
      <ReactHowler
        playing={playMessageSound}
        ref={refSoundMessageRecived}
        volume={volumes.commandRecived / 100}
        src={["/sounds/message-sound.mp3"]}
        html5={true}
      />
    </>
  );
};
