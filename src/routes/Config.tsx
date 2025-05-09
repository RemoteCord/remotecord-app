import { useFolderPicker } from "@/components/common/config/hooks/useFolderPicker";
import { DefaultConfig } from "@/components/config/DefaultConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Config = () => {
  const { openFolderDialog, folderPath } = useFolderPicker();
  const [settedPath, setSettedPath] = useState(false);
  const navigate = useNavigate();
  const handleRedirect = async () => {
    await navigate("/");
  };

  useEffect(() => {
    if (folderPath) setSettedPath(true);
  }, [folderPath]);

  return (
    <div className="w-[60%] mx-auto flex flex-col items-end">
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
        <div>
          <p>{folderPath}</p>
        </div>
      </div>
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
