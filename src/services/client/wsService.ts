import { Socket } from "socket.io-client";
import { ClientFileService } from "./fileService";
import { OsService } from "./OsService";
import { StoreService } from "../store";
import { invoke } from "@tauri-apps/api/core";
import { commandService } from "./commandService";
import { download } from "@tauri-apps/plugin-upload";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class WsService {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  // uploadFile = async (data: WS.UploadFile) => {
  //   try {

  //   } catch (error) {
  //     console.error("uploadFile error", error);
  //   }
  // };

  runCmdCommand = async (data: WS.RunCmdCommand) => {
    try {
      const { command } = data;
      console.log(`runCmdCommand`, command);
      const { stdout, pwd } = await commandService.executeCommand(command);

      this.socket.emit("runCmdCommand", {
        stdout,
        pwd,
      });

      console.log("run command", data);
    } catch (error) {
      console.error("runCmdCommand error", error);
    }
  };

  getScreenshot = async (data: WS.GetScreenshot) => {
    const { screenid } = data;
    console.log("getScreenshot", data);

    invoke("capture", { id: parseInt(screenid) }).then((image) => {
      const [base64, buffer] = image as [string, string];

      console.log(image);

      this.socket.emit("getScreenshotFromClient", {
        buffer,
      });
    });
  };

  getScreensFromClient = async (data: { identifier: string }) => {
    const screens = await OsService.getScreens();

    this.socket.emit("getScreensFromClient", {
      screens,
      identifier: data.identifier,
    });
  };

  getFilesFolder = async (data: WS.GetFilesFolder) => {
    try {
      const { folder, relativepath } = data;
      console.log("getFilesFromClient", data);

      const { files, relativePathResult } =
        await ClientFileService.getFilesFromFolder(folder, relativepath);

      this.socket.emit("getFilesFolder", {
        files,
        folder,
        relativepath: relativePathResult,
      });
    } catch (error) {
      console.error("getFilesFolder error", error);
    }
  };

  getFileFromClient = async (data: WS.GetFileFromClient) => {
    try {
      const store = new StoreService();

      const { token } = (await store.getRecord("auth")) as {
        token: string;
      };

      console.log("authtoken", token);
      console.log("getFileFromClient", data);
      const { fileroute, upload_url } = data;

      const path = await ClientFileService.resolvePath(fileroute);
      if (!path) return;

      const res = await invoke("open_file", {
        path,
        token,
        apiurl: upload_url, // Ensure api_url is passed here
      }).catch((err: any) => {
        console.error("open_file error", err);
      });

      console.log("open_file", res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("getFileFromClient error", errorMessage);
    }
  };

  getTasksFromClient = async () => {
    try {
      const tasks = await OsService.getTasks();
      console.log("getTasksFromClient", tasks);
      this.socket.emit("getTasksFromClient", { tasks: tasks });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("getTasksFromClient error", errorMessage);
    }
  };
}
