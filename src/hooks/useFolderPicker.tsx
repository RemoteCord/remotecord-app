"use client";
import { open } from "@tauri-apps/plugin-dialog";
import { useStoreTauri } from "./useStore";
import { useEffect } from "react";

export const useFolderPicker = () => {
  const { insertRecord, getRecord } = useStoreTauri();

  const openFolderDialog = async () => {
    const folder = await open({
      directory: true,
    });

    console.log(folder);
    insertRecord("downloadFolder", folder);
  };

  useEffect(() => {
    const getFolder = async () => {
      const folder = await getRecord("downloadFolder");
      console.log(folder);
    };

    void getFolder();
  }, []);

  return {
    openFolderDialog,
  };
};
