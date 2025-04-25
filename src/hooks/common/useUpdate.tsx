import { useEffect, useState } from "react";
import packageFile from "../../../package.json";

export type Platfroms = "windows-x86_64";

export interface Update {
  version: string;
  downloads: Record<string, string>;
  platfromKey: Platfroms[];
}

export const useUpdate = () => {
  const currentVersion = packageFile.version;
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [update, setUpdate] = useState<Update>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const response = await fetch("https://download.remotecord.app/");
        const data = (await response.json()) as Update;
        const latestVersion = data.version;

        setLatestVersion(latestVersion);
        setUpdate(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching update data:", error);
        setLoading(false);
      }
    };

    void checkForUpdate();
  }, []);

  return {
    currentVersion,
    latestVersion,
    update,
    loading,
  };
};
