"use client";
import { useSupabaseContextProvider } from "@/contexts/SupabaseContext";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { info } from "@tauri-apps/plugin-log";
export const CodeClient = () => {
  const { session } = useSupabaseContextProvider();
  const [copy, setCopy] = useState(false);

  const handleCopy = () => {
    if (!session) return;
    // info(`Copied ${session?.user.id} to clipboard`);
    setCopy(true);
    writeText(session?.user.id);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center h-fit gap-4 bg-secondary w-fit mx-auto rounded-lg overflow-hidden">
            <p className="pl-4  ">
              {session ? <span>{session?.user.id}</span> : <span>aaa</span>}
            </p>
            <button
              className="hover:bg-zinc-800 p-3 m-2 rounded-lg"
              onClick={handleCopy}
            >
              {copy ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-white font-[600]">
            Your ID for adding a controller
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
