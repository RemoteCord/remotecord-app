"use client";

// import { Command } from "@tauri-apps/plugin-shell";
import {
  executeBashScript,
  executePowershellScript,
  executePythonScript,
  hasCommand,
  likelyOnWindows,
  Command,
  whereIsCommand,
} from "tauri-plugin-shellx-api";
export function Shell() {
  const handler = async () => {
    const cmd = Command.create("powershell", ["echo Hello, World!"]);
    const out = await cmd.execute();
    const stdout = out.stdout;

    console.log(stdout);
  };

  return (
    <div>
      <button type="button" onClick={handler}>
        Execute hello world shell command
      </button>
    </div>
  );
}
