"use client";
import {
  exists,
  BaseDirectory,
  readFile,
  readDir,
  stat,
  DirEntry,
} from "@tauri-apps/plugin-fs";
import * as path from "@tauri-apps/api/path";
import { metadata } from "tauri-plugin-fs-pro-api";
import { FileRequest } from "@/types";

export type FileAndSize = DirEntry & { size?: number };
export type Folders = "Downloads" | "Documents" | "Desktop";

async function getPathFolder(folder: Folders) {
  let pathDir: string;
  switch (folder) {
    case "Downloads":
      pathDir = await path.downloadDir();
      break;
    case "Documents":
      pathDir = await path.documentDir();
      break;
    case "Desktop":
      pathDir = await path.desktopDir();
      break;
    default:
      pathDir = await path.downloadDir();
      break;
  }

  return pathDir;
}

export class ClientFileService {
  static getFileFromClient = async (
    fileroute: string
  ): Promise<FileRequest> => {
    try {
      // const filePath = await path.resolveResource("test-file.txt");
      console.log("getFileFromClient", fileroute, BaseDirectory);
      fileroute = fileroute.replaceAll("\\", "/");
      const [folder, ...rest] = fileroute.split("/");

      const pathDir = await getPathFolder(folder as Folders);
      const restroute = rest.join("/");
      const joinpath = await path.join(pathDir, restroute);

      console.log(
        "getFileFromClient",
        joinpath,
        folder,
        pathDir,
        rest,
        fileroute
      );

      const contents = await readFile(joinpath);
      const metadatafile = await metadata(joinpath);
      const buffer = new Uint8Array(contents).buffer;
      console.log("contents", contents, metadatafile, buffer);

      return {
        buffer,
        metadata: {
          filename: metadatafile.fullName,
          size: metadatafile.size,
          format: metadatafile.extname,
        },
      };
      // const folder = await readDir("astro", {
      //   baseDir: BaseDirectory.AppData,
      // });
      // console.log("folder", folder);
    } catch (error) {
      console.error("getFileFromClient", error);
      throw error;
    }
  };

  static getFilesFromFolder = async (
    folder: Folders,
    relativepath = ""
  ): Promise<{
    files: (DirEntry & { size?: number })[];
    relativePathResult: string;
  }> => {
    try {
      const pathDir = await getPathFolder(folder);
      const pathJoin = `${pathDir}/${relativepath}`;

      const filesAndFolders = await readDir(pathJoin, {
        baseDir: BaseDirectory.AppData,
      });

      const folders = filesAndFolders.filter((file) => file.isDirectory);
      const files = filesAndFolders.filter(
        (file) => !file.isDirectory && !file.name.endsWith(".ini")
      );

      const results: FileAndSize[] = [...folders, ...files];

      // Add size information for files
      for (const entry of results) {
        if (!entry.isDirectory) {
          const fileStat = await stat(`${pathJoin}/${entry.name}`);
          entry.size = fileStat.size;
        }
      }

      console.log("getFilesFromFolder", results);
      return {
        files: results,
        relativePathResult: pathJoin,
      };
    } catch (error) {
      console.error("getFilesFromFolder", error);
      throw error;
    }
  };
}
