import { fromBytesToMB } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/core";
import {
  allSysInfo,
  type AllSystemInfo,
  processes,
} from "tauri-plugin-system-info-api";

export class OsService {
  static getClientInfo = async (): Promise<{
    name: string;
    os: string;
    total_mem: number;
    used_mem: number;
  }> => {
    const sysInfo = await allSysInfo();

    const result: AllSystemInfo = {
      ...sysInfo,

      total_memory: fromBytesToMB(sysInfo.total_memory),
      used_memory: fromBytesToMB(sysInfo.used_memory),
      total_swap: fromBytesToMB(sysInfo.total_swap),
      used_swap: fromBytesToMB(sysInfo.used_swap),
    };

    const sysName = sysInfo.name ?? "";
    const sysVersion = sysInfo.os_version ?? "";
    console.log("sysinfo", result);
    return {
      name: result.hostname ?? "",
      os: `${sysName} ${sysVersion}`,
      total_mem: result.total_memory,
      used_mem: result.used_memory,
    };
  };

  static getScreens = async () => {
    const screensArray = (await invoke("get_screens")) as {
      id: number;
      resolution: [number, number];
      frequency: number;
      isprimary: boolean;
    }[];
    console.log("screens", screensArray);
    return screensArray.map((screen) => screen);
  };

  static getTasks = async () => {
    const tasks = await processes();
    console.log("tasks", tasks);
    return tasks;
  };
}
