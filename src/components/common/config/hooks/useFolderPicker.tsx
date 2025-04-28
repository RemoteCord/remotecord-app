"use client";
import { useStoreTauri } from "@/hooks/common";
import { open } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";

export const useFolderPicker = () => {
  const { insertRecord, getRecord } = useStoreTauri();
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const openFolderDialog = async () => {
    const folder = await open({
      directory: true,
    });

    console.log(folder);
    if (!folder) return;
    insertRecord("downloadFolder", folder);
    setFolderPath(folder);
  };

  const fetchFolder = async () => {
    const folder = await getRecord("downloadFolder");
    console.log(folder);
    if (!folder) {
      setLoading(false);
      return;
    }
    setFolderPath(folder as string);
    setLoading(false);
  };

  useEffect(() => {
    void fetchFolder();
  }, []);

  return {
    folderPath,
    openFolderDialog,
    fetchFolder,
    loading,
  };
};
