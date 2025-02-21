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

export type Folders = "Downloads" | "Documents" | "Desktop";

export class ClientService {
  static getFileFromClient = async (
    fileroute: string
  ): Promise<FileRequest> => {
    try {
      // const filePath = await path.resolveResource("test-file.txt");
      const desktopDir = await path.desktopDir();
      // console.log("getFileFromClient", fileroute, BaseDirectory, desktopDir);
      const contents = await readFile(await path.join(desktopDir, fileroute));
      const metadatafile = await metadata(
        await path.join(desktopDir, fileroute)
      );
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
    files: DirEntry[];
    relativePathResult: string;
  }> => {
    try {
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
      const pathJoin = `${pathDir}/${relativepath}`;

      const filesAndFolders = await readDir(pathJoin, {
        baseDir: BaseDirectory.AppData,
      });

      const folders = filesAndFolders.filter((file) => file.isDirectory);
      const files = filesAndFolders.filter((file) => !file.isDirectory);

      const results = [...folders, ...files];

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
