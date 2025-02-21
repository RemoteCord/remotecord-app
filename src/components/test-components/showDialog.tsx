"use client";

import { ask, confirm, message, open, save } from "@tauri-apps/plugin-dialog";

export function ShowDialog() {
  const handlerAsk = async () => {
    const answer = await ask("This action cannot be reverted. Are you sure?", {
      title: "Tauri",
      kind: "warning",
    });

    console.log(answer);
  };

  const handlerConfirmation = async () => {
    const confirmation = await confirm(
      "This action cannot be reverted. Are you sure?",
      { title: "Tauri", kind: "warning" }
    );

    console.log(confirmation);
  };

  const handlerMessage = async () => {
    await message("File not found", { title: "Tauri", kind: "error" });
  };

  const handlerFile = async () => {
    const file = await open({
      multiple: false,
      directory: false,
    });
    console.log(file);
  };

  const handlerSaveFile = async () => {
    const path = await save({
      filters: [
        {
          name: "My Filter",
          extensions: ["png", "jpeg"],
        },
      ],
    });
    console.log(path);
  };

  return (
    <div className="border p-4 flex gap-4 w-fit rounded-lg my-4">
      <button type="button" onClick={handlerAsk}>
        Sow Dialog
      </button>

      <button type="button" onClick={handlerConfirmation}>
        Sow Confirm
      </button>
      <button type="button" onClick={handlerMessage}>
        Sow Message
      </button>
      <button type="button" onClick={handlerFile}>
        Sow File
      </button>
      <button type="button" onClick={handlerSaveFile}>
        Sow File Save
      </button>
    </div>
  );
}
