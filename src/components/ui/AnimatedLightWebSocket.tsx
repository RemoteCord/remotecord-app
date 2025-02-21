import { useWsContextProvider } from "@/contexts/WsContext";
import { motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

export default function AnimatedLightWebSocket() {
  const { connected } = useWsContextProvider();

  const [color, setColor] = useState("255,255,255");

  useEffect(() => {
    setColor(connected ? "108, 196, 132" : "255,255,255");
  }, [connected]);

  return (
    <div className="relative h-40">
      <motion.div
        className={
          " w-6 h-6 rounded-full m-10 absolute transition-colors duration-500"
        }
        style={{
          boxShadow: `0px 0px 30px 0px rgba(${color},0.7)`,
          backgroundColor: `rgba(${color},1)`,
        }}
        initial={{
          scale: 1,
        }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            `0px 0px 30px 0px rgba(${color},0.7)`,
            `0px 0px 40px 0px rgba(${color},1)`,
            `0px 0px 30px 0px rgba(${color},0.7)`,
          ],

          y: [0, -10, 0],
        }}
        transition={{
          scale: {
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          },
          y: {
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          },
          boxShadow: {
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          },

          ease: "easeIn",
        }}
      />
    </div>
  );
}
