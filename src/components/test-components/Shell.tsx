"use client";

import { useState } from "react";
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
  const [command, setCommand] = useState("");

  const handler = async () => {
    const { code, signal, stderr, stdout } = await executePowershellScript(
      command
    );

    console.log("Command started", code);
    // cmd.on("close", (data) => {
    //   console.log(`Command finished with code ${data.code}`);
    // });
    // cmd.on("error", (error) => {
    //   console.error(`Command error: ${error}`);
    // });
    // cmd.stdout.on("data", (line) => {
    //   console.log(`stdout: ${line}`);
    // });
    // cmd.stderr.on("data", (line) => {
    //   console.error(`stderr: ${line}`);
    // });

    // await cmd.spawn();
  };

  return (
    <div>
      <button type="button" onClick={handler}>
        Execute hello world shell command
      </button>
      <input
        type="text"
        onChange={(e) => setCommand(e.target.value)}
        className="text-black"
      />
    </div>
  );
}
