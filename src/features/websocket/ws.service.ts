import { invoke } from "@tauri-apps/api/core";
import type { Socket } from "socket.io-client";
import { FileService, OsService, commandService } from "./services";

export class WsService {
	constructor(private readonly socket: Socket) {}

	runCmdCommand = async (data: WS.RunCmdCommand) => {
		try {
			const { command } = data;
			console.log("runCmdCommand", command);
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

		invoke("capture", { id: Number.parseInt(screenid) }).then((image) => {
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
				await FileService.getFilesFromFolder(folder, relativepath);

			this.socket.emit("getFilesFolder", {
				files,
				folder,
				relativepath: relativePathResult,
			});
		} catch (error) {
			console.error("getFilesFolder error", error);
		}
	};

	getFileFromClient = async (data: WS.GetFileFromClient, token: string) => {
		try {
			console.log("authtoken", token);
			console.log("getFileFromClient", data);
			const { fileroute, upload_url } = data;

			const path = await FileService.resolvePath(fileroute);
			if (!path) return;

			const res = await invoke("open_file", {
				path,
				token,
				apiurl: upload_url, // Ensure api_url is passed here
			}).catch((err: unknown) => {
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
