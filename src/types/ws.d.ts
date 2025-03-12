namespace WS {
  export interface GetScreenshot {
    screenid: string;
  }
  export interface GetFilesFolder {
    folder: Folders;
    relativepath: string;
  }

  export interface GetFileFromClient {
    fileroute: string;
    tokenFile: string;
  }

  export interface UploadFile {
    fileroute: string;
  }

  export interface RunCmdCommand {
    command: string;
  }
}
