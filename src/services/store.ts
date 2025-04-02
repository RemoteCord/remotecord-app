import { load } from "@tauri-apps/plugin-store";

type Records = "auth" | "downloadFolder" | "autoaccept" | "sounds";

export class StoreService {
  private name: string;
  constructor(name = "store") {
    this.name = name;
  }

  getAllRecords = async () => {
    const store = await load(`${this.name}.json`, { autoSave: true });
    console.log("store", store);
    return await store.entries();
  };

  insertRecord = async (key: Records, value: any) => {
    const store = await load(`${this.name}.json`, { autoSave: true });
    await store.set(key, value);
    await store.save();
  };
  getRecord = async <T>(key: Records) => {
    const store = await load(`${this.name}.json`, { autoSave: true });
    return store.get(key) as T;
  };

  deleteRecord = async (key: Records) => {
    const store = await load(`${this.name}.json`, { autoSave: true });
    await store.delete(key);
  };

  cleanStore = async () => {
    const store = await load(`${this.name}.json`, { autoSave: true });

    await store.clear();
  };
}
