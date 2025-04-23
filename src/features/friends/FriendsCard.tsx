import { useEffect } from "react";
import { FriendCard } from "./FriendCard";
import { useFriends } from "./hooks/useFriends";

export const FriendsCard = () => {
  const { friends, getFriends } = useFriends();

  useEffect(() => {
    void getFriends();
  }, []);

  return (
    <div className=" grid grid-cols-3 w-[100%] mt-10 gap-4 mx-auto">
      {friends?.map((friend, idx) => (
        <FriendCard key={friend.controllerid} friend={friend} idx={idx} />
      ))}
    </div>
  );
};
