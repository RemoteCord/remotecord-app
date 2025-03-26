"use client";

import { Friend, Permissions, useFriends } from "@/hooks/useFriends";
import { IconEdit, IconTrashFilled } from "@tabler/icons-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialogConnection";

export const FriendCard: React.FC<{ friend: Friend }> = ({
  friend,
  ...props
}) => {
  const { deleteFriend, syncPermissions } = useFriends();

  const [permissions, setPermissions] = useState(friend.permissions);
  const handleUpdatePermission = (key: keyof Permissions, state: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !state,
    }));
  };

  const handleSavePermissions = async () => {
    if (permissions === friend.permissions) return;

    const { status } = await syncPermissions(permissions, friend.controllerid);

    if (status) {
      console.log("Permissions updated");
      return;
    }

    setPermissions(friend.permissions);
  };

  return (
    <div
      {...props}
      className="flex items-center group gap-4 border-2 justify-between p-4 rounded-xl border-secondary"
    >
      <div className="flex gap-4  items-center">
        <Image
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
        <Dialog>
          <DialogTrigger className="hover:bg-secondary group-hover:opacity-100 opacity-0 p-2 rounded-lg transition-all duration-300">
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
            <div className="flex flex-col gap-4">
              {(
                Object.entries(permissions) as [keyof Permissions, boolean][]
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[100px_140px] gap-4 h-10 items-center"
                >
                  <p>{key}</p>

                  {value ? (
                    <button
                      onClick={() => handleUpdatePermission(key, true)}
                      className="bg-green-900 h-full rounded-lg hover:bg-green-800 transition-all duration-300"
                    >
                      Activated
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdatePermission(key, false)}
                      className="bg-red-900 h-full rounded-lg hover:bg-red-800 transition-all duration-300"
                    >
                      Deactivated
                    </button>
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild className="">
                <Button onClick={handleSavePermissions} variant={"default"}>
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
