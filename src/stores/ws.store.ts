import { create } from "zustand";

interface WsEvents {
  getFile: {
    fileroute: string;
  };

  setGetFile(fileroute: string): void;
}

export const useWsStore = create<WsEvents>()((set) => ({
  getFile: {
    fileroute: "",
  },
  setGetFile: (fileroute) => set({ getFile: { fileroute } }),
}));
