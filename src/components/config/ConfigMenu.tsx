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

export const ConfigMenu = () => {
  const { openFolderDialog } = useFolderPicker();
  const { username, handleChangeUsername, setUsername } = useUserInfo();

  return (
    <Sheet>
      <SheetTrigger className=" hover:bg-zinc-900 bg-secondary  transition-all duration-300 px-2 rounded-lg flex gap-2 items-center">
        <IconSettingsFilled />
        Config
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Configuration</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex gap-6 flex-col">
          <div>
            <Input
              value={username}
              onBlur={(e) => handleChangeUsername(e.target.value)}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="font-[600]">Auto accept friend connections</h2>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="font-[600]">Default download path</h2>
            <Button onClick={openFolderDialog} className="h-6 font-[600]">
              Pick Folder
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
