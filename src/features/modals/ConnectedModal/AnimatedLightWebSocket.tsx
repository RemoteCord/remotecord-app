import { useWsClientContext } from "@/features/websocket/WsClient";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function AnimatedLightWebSocket() {
	const { connected } = useWsClientContext();

	const [color, setColor] = useState("255,255,255");

	useEffect(() => {
		setColor(connected ? "108, 196, 132" : "255,255,255");
	}, [connected]);

	return (
		<motion.div
			className={" w-10 h-10 rounded-full m-10 transition-colors duration-500"}
			style={{
				boxShadow: `0px 0px 40px 0px rgba(${color},0.7)`,
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
	);
}
