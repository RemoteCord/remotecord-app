import { load } from "@tauri-apps/plugin-store";

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

  insertRecord = async (key: string, value: string) => {
    const store = await load(`${this.name}.json`, { autoSave: true });

    store.set(key, value);
  };

  getRecord = async (key: string) => {
    const store = await load(`${this.name}.json`, { autoSave: true });

    return store.get(key);
  };

  cleanStore = async () => {
    const store = await load(`${this.name}.json`, { autoSave: true });

    await store.clear();
  };
}
