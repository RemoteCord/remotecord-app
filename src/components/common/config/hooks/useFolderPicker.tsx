"use client";
import { open } from "@tauri-apps/plugin-dialog";
import { useStoreTauri } from "@/hooks/common";
import { useEffect, useState } from "react";

export const useFolderPicker = () => {
  const { insertRecord, getRecord } = useStoreTauri();
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const openFolderDialog = async () => {
    const folder = await open({
      directory: true,
    });

    console.log(folder);
    insertRecord("downloadFolder", folder);
    setFolderPath(folder);
  };

  useEffect(() => {
    const getFolder = async () => {
      const folder = await getRecord("downloadFolder");
      console.log(folder);
      if (!folder) return;
      setFolderPath(folder as string);
    };

    void getFolder();
  }, []);

  return {
    folderPath,
    openFolderDialog,
  };
};
