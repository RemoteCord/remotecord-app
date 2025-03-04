namespace WS {
  export interface GetFilesFolder {
    folder: Folders;
    relativepath: string;
  }

  export interface GetFileFromClient {
    fileroute: string;
  }

  export interface UploadFile {
    fileroute: string;
  }
}
