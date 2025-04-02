import { Friend, useFriends } from "@/hooks/useFriends";
import { FriendCard } from "./FriendCard";
import { useEffect, useState } from "react";

export const FriendsCard = () => {
  const { friends, getFriends } = useFriends();

  const [localFriends, setLocalFriends] = useState<Friend[]>([]);

  useEffect(() => {
    void getFriends().then((res) => {
      setLocalFriends(res);
    });
  }, []);

  useEffect(() => {
    console.log("friends", friends);
    setLocalFriends(friends);
  }, [friends]);
  return (
    <div className=" grid grid-cols-3 w-[100%] mt-10 gap-4 mx-auto">
      {localFriends.map((friend, idx) => (
        <FriendCard key={friend.controllerid} friend={friend} idx={idx} />
      ))}
    </div>
  );
};
