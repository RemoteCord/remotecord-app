import { useUpdate } from "@/hooks/common/useUpdate";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { openUrl } from "@tauri-apps/plugin-opener";
import { exit } from "@tauri-apps/plugin-process";

const Update = () => {
  const {
    loading: loadingUpdateRequest,
    currentVersion,
    latestVersion,
  } = useUpdate();

  const navigator = useNavigate();

  useEffect(() => {
    if (loadingUpdateRequest) return;

    if (currentVersion === latestVersion) {
      navigator("/");
    }
  }, [loadingUpdateRequest]);

  const updateHandler = async () => {
    await openUrl("https://download.remotecord.app/windows-x86_64");
    await exit(0);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center pb-40">
      <div className="flex flex-col items-center justify-center gap-10">
        <p className="text-4xl">There's a new version available!</p>
        <button
          type="button"
          className="button_style px-4 py-2 rounded-lg"
          onClick={updateHandler}
        >
          Download the latest version
        </button>
      </div>
    </div>
  );
};

export default Update;
