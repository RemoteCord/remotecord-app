"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogWithoutX";
import { DialogFooter } from "@/components/ui/dialogConnection";
import { IconEdit, IconTrashFilled } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useState } from "react";
import { type Friend, type Permissions, useFriends } from "./hooks/useFriends";

const permissionsAdapter = {
  explorer: "Explorer",
  getFile: "Get File",
  process: "View Tasks",
  screenshot: "Screenshot",
  shell: "Shell",
  uploadFile: "Upload File",
  keylogger: "Keylogger",
  cameras: "View Camera",
};

export const FriendCard: React.FC<{ friend: Friend; idx: number }> = ({
  friend,
  idx,
  ...props
}) => {
  const { deleteFriend, syncPermissions } = useFriends();
  const [openModal, setOpenModal] = useState(false);
  const [permissions, setPermissions] = useState(friend.permissions);
  const handleUpdatePermission = (key: keyof Permissions, state: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !state,
    }));
  };

  const handleSavePermissions = async () => {
    setOpenModal(false);
    if (permissions === friend.permissions) return;

    const { status } = await syncPermissions(permissions, friend.controllerid);

    if (status) {
      console.log("Permissions updated");

      return;
    }

    setPermissions(friend.permissions);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      {...props}
      className="flex items-center group gap-4 border-2 justify-between p-4 rounded-xl border-secondary"
    >
      <div className="flex gap-4  items-center">
        <img
          crossOrigin="anonymous"
          width={50}
          height={50}
          src={friend.picture}
          alt={friend.name}
          className="w-[40px] h-[40px] rounded-full object-cover"
        />
        <p>{friend.name}</p>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger className="hover:bg-red-900  group-hover:opacity-100 opacity-0 p-2 rounded-lg transition-all duration-300">
            <IconTrashFilled size={20} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              {/* <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription> */}
            </DialogHeader>
            <div className="flex gap-4 ">
              <DialogClose asChild className="">
                <Button
                  variant={"destructive"}
                  onClick={() => deleteFriend(friend.controllerid)}
                >
                  Delete
                </Button>
              </DialogClose>
              <DialogClose asChild className="">
                <Button variant={"default"}>Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={openModal}>
          <DialogTrigger
            onClick={() => setOpenModal(true)}
            className="hover:bg-secondary group-hover:opacity-100 opacity-0 p-2 rounded-lg transition-all duration-300"
          >
            <IconEdit size={20} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Permissions table</DialogTitle>
              {/* <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4">
              {(
                Object.entries(permissions) as [keyof Permissions, boolean][]
              ).map(([key, value]) => (
                <div key={key} className=" h-10 w-28 items-center">
                  {value ? (
                    <button
                      type="button"
                      onClick={() => handleUpdatePermission(key, true)}
                      className=" bg-white text-black  h-full w-full rounded-lg transition-all duration-300"
                    >
                      {permissionsAdapter[key]}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdatePermission(key, false)}
                      className="button_style h-full  w-full rounded-lg  transition-all duration-300"
                    >
                      {permissionsAdapter[key]}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild className="">
                <button
                  type="button"
                  className="bg-[#27272a] hover:bg-[#404044] transition-all duration-300 w-20 h-10 rounded-lg"
                  onClick={handleSavePermissions}
                >
                  Save
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};
