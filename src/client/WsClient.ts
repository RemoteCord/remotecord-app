import { env } from "@/env.config";
import { Manager } from "socket.io-client";

export const wsManager = new Manager(env.NEXT_PUBLIC_WS_URL, {
  autoConnect: true,
  reconnectionDelayMax: 10000,
});
