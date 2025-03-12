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

export const ConfigMenu = () => {
  const { openFolderDialog } = useFolderPicker();

  return (
    <Sheet>
      <SheetTrigger>Config</SheetTrigger>
      <SheetContent side={"left"} className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Configuration</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex gap-6 flex-col">
          <div className="flex items-center justify-between">
            <h2 className="font-[600]">Auto accept connections</h2>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="font-[600]">Default download path</h2>
            <Button onClick={openFolderDialog} className="h-6 font-[600]">
              folder
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
