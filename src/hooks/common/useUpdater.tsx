import { useEffect } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export const useUpdater = () => {
  useEffect(() => {
    const checkUpdate = async () => {
      const update = await check();

      console.log("update", update);

      if (update) {
        console.log(
          `found update ${update.version} from ${update.date} with notes ${update.body}`
        );
        let downloaded = 0;
        let contentLength = 0;
        // alternatively we could also call update.download() and update.install() separately
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              contentLength = event.data.contentLength ?? 0;
              console.log(
                `started downloading ${event.data.contentLength ?? 0} bytes`
              );
              console.log("a");
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              console.log(`downloaded ${downloaded} from ${contentLength}`);
              break;
            case "Finished":
              console.log("download finished");
              break;
          }
        });

        console.log("update installed");
        await relaunch();
      }
    };

    void checkUpdate();
  }, []);
};
