import { StoreService } from "@/services/store";

export const useStoreTauri = () => {
  const store = new StoreService();

  return store;
};
