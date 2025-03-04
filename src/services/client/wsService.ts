import { Socket } from "socket.io-client";
import { ClientFileService } from "./fileService";
import { OsService } from "./OsService";

export class WsService {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  getFilesFolder = async (data: WS.GetFilesFolder) => {
    try {
      const { folder, relativepath } = data;
      console.log("getFileFromClient", data);

      const { files, relativePathResult } =
        await ClientFileService.getFilesFromFolder(folder, relativepath);

      this.socket.emit("getFilesFolder", {
        files,
        folder,
        relativepath: relativePathResult,
      });
    } catch (error) {}
  };

  getFileFromClient = async (data: WS.GetFileFromClient) => {
    try {
      console.log("getFileFromClient", data);
      const { fileroute } = data;
      const { buffer, metadata } = await ClientFileService.getFileFromClient(
        fileroute
      );

      console.log("getFileFromClient", buffer, metadata);

      this.socket.emit("getFileFromClient", {
        buffer,
        metadata,
      });
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
