import { useState, useEffect } from "react";

export const useDeviceDetection = () => {
  const [device, setDevice] = useState("");

  useEffect(() => {
    const handleDeviceDetection = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      const isTablet =
        /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

      console.log("userAgent", userAgent);
      if (isMobile) {
        setDevice("Mobile");
      } else if (isTablet) {
        setDevice("Tablet");
      } else {
        setDevice("Desktop");
      }
    };

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => {
      window.removeEventListener("resize", handleDeviceDetection);
    };
  }, []);

  useEffect(() => {
    console.log("device", device);
  }, [device]);

  return device;
};
