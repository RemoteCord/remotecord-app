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
import { executePowershellScript } from "tauri-plugin-shellx-api";

export class CommandService {
  pwd: string = "C:\\";

  constructor() {}

  executeCommand = async (command: string) => {
    // Check if command starts with cd

    const commands = command.split(";").map((cmd) => cmd.trim());
    for (const cmd of commands) {
      if (cmd.toLowerCase().startsWith("cd")) {
        const newPath = cmd.substring(2).trim();
        if (newPath.match(/^[a-zA-Z]:\\/)) {
          // If the new path starts with a drive letter, set it directly
          this.pwd = newPath;
        } else {
          // Otherwise, join it with the current path
          this.pwd = await path.join(this.pwd, newPath);
        }
        // Fix multiple C:\ occurrences
        this.pwd = this.pwd.replace(/^(C:\\)+/i, "C:\\");
      }
    }
    command = command.replace(/cd [^;]+;/g, "");

    console.log("Command path", this.pwd);

    const { code, signal, stderr, stdout } = await executePowershellScript(
      `cd ${this.pwd}; ${command}`
    );

    console.log("Command started", stdout);
    const lines = stdout.split("\r\n");
    const pwdIndex = lines.findIndex((line) => line === "[[PWD]]");
    if (pwdIndex !== -1 && pwdIndex < lines.length - 1) {
      this.pwd = lines[pwdIndex + 1];
      lines.splice(pwdIndex, 2);
    }

    console.log("Command started", lines);

    return {
      stdout,
      pwd: this.pwd,
    };
  };
}

export const commandService = new CommandService();
