import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";

export const FriendModal = ({
  openModal,
  controllerData,
  handleAcceptFriend,
  setOpenModal,
}: {
  openModal: boolean;
  controllerData: {
    username: string;
    avatar: string;
  };
  handleAcceptFriend: () => void;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="flex gap-4 items-center">
            <span>
              {controllerData?.avatar && (
                <Image
                  src={controllerData?.avatar}
                  alt="avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              )}
            </span>
            {controllerData?.username} wants to add you as a friend
          </DialogTitle>
          <DialogDescription className="flex gap-8">
            <Button onClick={handleAcceptFriend}>Accept</Button>

            <Button variant={"destructive"} onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
