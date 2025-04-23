import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useUserInfo } from "@/hooks/authentication/useUserInfo";
import { DialogTrigger } from "@radix-ui/react-dialog";
// import { Settings } from "lucide-react";
import { IconSettingsFilled } from "@tabler/icons-react";
// import { useStoreTauri } from "@/hooks/useStore";
import { ConfigCard } from "./ConfigCard";
import { useConnection } from "./hooks/useConnection";
import { useFolderPicker } from "./hooks/useFolderPicker";
import { useAutostart } from "@/hooks/common/useAutostart";
import { useSession } from "@/hooks/authentication";
import { useState } from "react";
// import { useConnection } from "@/hooks/useConnection";
// import { SoundModal } from "../modals/SoundModal";

export const ConfigMenu = () => {
  const { openFolderDialog, folderPath } = useFolderPicker();
  const { signOut } = useSession();
  const { handleAutoacceptConnection, autoaccept } = useConnection();
  const { username, handleChangeUsername, setUsername } = useUserInfo();
  const { isAutostartEnabled, toggleAutostart } = useAutostart();
  const [open, setOpen] = useState(false);
  // const { cleanStore, deleteRecord } = useStoreTauri();

  // const handleSignOut = async () => {
  //   // await deleteRecord("auth");
  //   location.reload();
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" hover:bg-zinc-900 bg-secondary  transition-all duration-300 px-2 rounded-lg flex gap-2 items-center hover:cursor-pointer">
        <IconSettingsFilled />
        Config
      </DialogTrigger>
      <SheetContent side={"left"} className="w-[600px] p-4">
        <SheetHeader>
          <SheetTitle>Configuration</SheetTitle>
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 ">
            <div className="">
              <Input
                // value={username}
                // onBlur={(e) => handleChangeUsername(e.target.value)}
                //@ts-ignore
                onChange={(e) => setUsername(e.target.value)}
                defaultValue={username}
              />
            </div>
            <ConfigCard className="flex items-center justify-between">
              <h2 className="font-[600]">Auto accept friend connections</h2>
              <Switch
                checked={autoaccept}
                onCheckedChange={handleAutoacceptConnection}
              />
            </ConfigCard>
            <ConfigCard className="flex items-center justify-between">
              <h2 className="font-[600]">Autostart</h2>
              <Switch
                defaultChecked={isAutostartEnabled}
                onCheckedChange={(value) => toggleAutostart(value)}
              />
            </ConfigCard>
            <ConfigCard className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
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
            </ConfigCard>
            {/*<div>
              <SoundModal />
            </div>
          </div>
           */}
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="w-full bg-red-900 px-4 py-2 rounded-lg hover:bg-red-900/80 transition-all duration-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </SheetContent>
    </Dialog>
  );
};
