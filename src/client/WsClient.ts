import { Manager } from "socket.io-client";

export const wsManager = new Manager("wss://api2.luqueee.dev", {
  autoConnect: true,
  reconnectionDelayMax: 10000,
});
