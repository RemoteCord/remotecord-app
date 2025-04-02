import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useFolderPicker } from "@/hooks/useFolderPicker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUserInfo } from "@/hooks/useUserInfo";
// import { Settings } from "lucide-react";
import { IconSettingsFilled } from "@tabler/icons-react";
import { useStoreTauri } from "@/hooks/useStore";
import { ConfigCard } from "./ConfigCard";
import { useConnection } from "@/hooks/useConnection";
import { SoundModal } from "../modals/SoundModal";

export const ConfigMenu = () => {
  const { openFolderDialog, folderPath } = useFolderPicker();
  const { handleAutoacceptConnection, autoaccept } = useConnection();
  const { username, handleChangeUsername, setUsername } = useUserInfo();
  const { cleanStore, deleteRecord } = useStoreTauri();

  const handleSignOut = async () => {
    await deleteRecord("auth");
    location.reload();
  };

  return (
    <Sheet>
      <SheetTrigger className=" hover:bg-zinc-900 bg-secondary  transition-all duration-300 px-2 rounded-lg flex gap-2 items-center">
        <IconSettingsFilled />
        Config
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[600px]">
        <SheetHeader>
          <SheetTitle>Configuration</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4">
            <div>
              <Input
                value={username}
                // onBlur={(e) => handleChangeUsername(e.target.value)}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <ConfigCard className="flex items-center justify-between">
              <h2 className="font-[600]">Auto accept friend connections</h2>
              <Switch
                checked={autoaccept}
                onCheckedChange={handleAutoacceptConnection}
              />
            </ConfigCard>
            <ConfigCard className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-[600]">Default download path</h2>
                <button
                  onClick={openFolderDialog}
                  className="button_style border px-4 py-1 flex items-center rounded-lg hover:border-secondary"
                >
                  Pick Folder
                </button>
              </div>
              <div>
                <p>{folderPath}</p>
              </div>
            </ConfigCard>
            <div>
              <SoundModal />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-900 px-4 py-2 rounded-lg hover:bg-red-900/80 transition-all duration-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
