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
  static resolvePath = async (fileroute: string) => {
    try {
      fileroute = fileroute.replaceAll("\\", "/");
      const [folder, ...rest] = fileroute.split("/");
      const pathDir = await getPathFolder(folder as Folders);
      const joinpath = await path.join(pathDir, rest.join("/"));
      return joinpath;
    } catch (error) {
      console.error("resolvePath", error);
      throw error;
    }
  };

  static getMetadata = async (path: string) => {
    try {
      const metadatafile = await metadata(path);
      return {
        ...metadatafile,
        size: Math.round((metadatafile.size / (1024 * 1024)) * 100) / 100,
      };
    } catch (error) {
      console.error("getMetadata", error);
      throw error;
    }
  };

  static getFileFromClient = async (path: string): Promise<FileRequest> => {
    try {
      // const filePath = await path.resolveResource("test-file.txt");
      const contents = await readFile(path);
      const metadatafile = await metadata(path);
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
