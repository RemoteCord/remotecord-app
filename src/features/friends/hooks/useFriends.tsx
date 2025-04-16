"use client";
import { useApi } from "@/hooks/common/useApi";
import { useFriendsStore } from "@/stores/friends/friends.store";
import { useEffect } from "react";

export interface Friend {
  name: string;
  picture: string;
  controllerid: string;
  permissions: Permissions;
}

export interface Permissions {
  explorer: boolean;
  getFile: boolean;
  process: boolean;
  screenshot: boolean;
  shell: boolean;
  uploadFile: boolean;
}

export const useFriends = () => {
  const { friends, setFriends, deleteFriendFromStore } = useFriendsStore();

  const { request } = useApi();
  const getFriends = async () => {
    const res = await request<{
      friends: Friend[];
    }>("/api/clients/friends", {
      method: "GET",
    });
    console.log("res", res);

    if (!res) return [];

    setFriends(res.friends);
    return res.friends;
  };

  const deleteFriend = async (controllerid: string) => {
    const res = await request<{ status: boolean }>(
      `/api/clients/friends/${controllerid}`,
      {
        method: "DELETE",
      }
    );
    console.log("res", res);

    if (!res) return { status: false };

    deleteFriendFromStore(controllerid);

    return res;

    // location.reload();
  };

  useEffect(() => {
    console.log("friends hook", friends);
  }, [friends]);

  const syncPermissions = async (
    permissions: Permissions,
    controllerid: string
  ) => {
    const res = await request<{ status: boolean }>(
      "/api/clients/friends/permissions",
      {
        method: "POST",
        body: JSON.stringify({
          permissions,
          controllerid,
        }),
      }
    );
    console.log("res", res);

    if (!res) return { status: false };

    return res;
    // location.reload();
  };

  return { getFriends, deleteFriend, syncPermissions, friends };
};
