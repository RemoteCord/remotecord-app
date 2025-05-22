import { ConfigCard } from "@/components/common/config/ConfigCard";
import { useConnection } from "@/components/common/config/hooks/useConnection";
import { useFolderPicker } from "@/components/common/config/hooks/useFolderPicker";
import { DefaultConfig } from "@/components/config/DefaultConfig";
import { Switch } from "@/components/ui/switch";
import { useAutostart } from "@/hooks/common/useAutostart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Config = () => {
  const { openFolderDialog, folderPath } = useFolderPicker();
  const { handleAutoacceptConnection, autoaccept } = useConnection();
  const { toggleAutostart, isAutostartEnabled } = useAutostart();
  const [settedPath, setSettedPath] = useState(false);
  const navigate = useNavigate();
  const handleRedirect = async () => {
    await navigate("/");
  };

  useEffect(() => {
    if (folderPath) setSettedPath(true);
  }, [folderPath]);

  return (
    <div className="w-[60%] mx-auto flex gap-4 flex-col items-end">
      <div className="  bg-zinc-900 p-4 w-full rounded-lg">
        <div className="flex items-center justify-between ">
          <h2 className="font-[600]">Default download path</h2>
          <button
            type="button"
            onClick={openFolderDialog}
            className="button_style border px-4 py-1 flex items-center rounded-lg hover:border-secondary"
          >
            Pick Folder
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-300">
            Choose where files will be downloaded.
          </p>
          <p>{folderPath}</p>
        </div>
      </div>
      <ConfigCard className="flex flex-col w-full p-4 gap-4 ">
        <div className="flex items-center justify-between w-full gap-2">
          <h2 className="font-[600]">Auto accept friend connections</h2>
          <Switch
            checked={autoaccept}
            onCheckedChange={handleAutoacceptConnection}
          />
        </div>
        <p className="text-sm text-gray-300">
          Automatically accept incoming connection requests.
        </p>
      </ConfigCard>
      <ConfigCard className="flex flex-col w-full p-4 gap-4">
        <div className="flex items-center justify-between w-full gap-2">
          <h2 className="font-[600]">Autostart</h2>
          <Switch
            defaultChecked={isAutostartEnabled}
            onCheckedChange={(value) => toggleAutostart(value)}
          />
        </div>
        <div>
          <p className="text-sm text-gray-300">
            Toggle wether the appication starts on boot.
          </p>
        </div>
      </ConfigCard>
      <button
        type="button"
        disabled={!settedPath}
        onClick={handleRedirect}
        className="button_style px-4 py-1 mt-4 rounded-lg disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
};

export default Config;
