"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/hooks/authentication";
import { cn } from "@/lib/utils";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
// import { info } from "@tauri-apps/plugin-log";
export const CodeClient = () => {
  const [copy, setCopy] = useState(false);
  const { user } = useSession();

  const [formattedId, setFormattedId] = useState<string>("");

  const handleCopy = async () => {
    // info(`Copied ${session?.user.id} to clipboard`);
    setCopy(true);
    writeText(formattedId);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  useEffect(() => {
    console.log("user", user);
    const id = user?.sub;

    if (id) setFormattedId(id);
  }, [user]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="grid grid-cols-[1fr_auto] items-center justify-center h-15 gap-2 bg-secondary w-[300px] mx-auto rounded-lg ">
            <p
              className={cn(
                "ml-2 px-2 my-2 w-full text-center justify-center h-[80%] rounded-md flex items-center",
                !user && "bg-zinc-900 animate-pulse duration-1000"
              )}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={
                  user
                    ? {
                        opacity: 1,
                        transition: { duration: 0.5, delay: 0.2 },
                      }
                    : {}
                }
              >
                {formattedId}
              </motion.span>
            </p>
            <button
              type="button"
              className="hover:bg-zinc-800 p-3 m-2 rounded-lg hover:cursor-pointer"
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
