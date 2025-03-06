import { Socket } from "socket.io-client";
import { ClientFileService } from "./fileService";
import { OsService } from "./OsService";
import { litterbox } from "./catbox";
import { commandService } from "./commandService";

export class WsService {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  uploadFile = async (data: WS.UploadFile) => {
    try {
      const { fileroute } = data;
      console.log("uploadFile", data);
    } catch (error) {}
  };
  runCmdCommand = async (data: WS.RunCmdCommand) => {
    try {
      const { command } = data;

      const { stdout, pwd } = await commandService.executeCommand(command);

      this.socket.emit("runCmdCommand", {
        stdout,
        pwd,
      });

      console.log("run command", data);
    } catch (error) {}
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
    } catch (error) {}
  };

  getFileFromClient = async (data: WS.GetFileFromClient) => {
    try {
      console.log("getFileFromClient", data);
      const { fileroute } = data;

      const path = await ClientFileService.resolvePath(fileroute);
      if (!path) return;
      const { size, name } = await ClientFileService.getMetadata(path);
      console.log("metadataFile", size, name);

      if (size <= 10) {
        const { buffer, metadata } = await ClientFileService.getFileFromClient(
          path
        );

        console.log("getFileFromClient result", buffer, metadata, size);
        this.socket.emit("getFileFromClient", {
          buffer,
          metadata,
        });
      } else {
        const res = await litterbox
          .upload({
            path,
            duration: "12h",
          })
          .catch((err) => {
            console.error(err);
          });
        console.log("litterbox", res);
      }
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
