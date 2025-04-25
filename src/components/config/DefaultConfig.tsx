import { useWebcams } from "@/features/webcam/hooks/useWebcams";
import { useEffect } from "react";

export const DefaultConfig = () => {
  const { requestPermission } = useWebcams();

  useEffect(() => {
    requestPermission();
  }, []);

  return <></>;
};
