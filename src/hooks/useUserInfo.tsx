"use client";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";

export const useUserInfo = () => {
  const { request } = useApi();
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    request("/api/clients/user-info").then((res: { username: string }) => {
      console.log("res", res);
      setUsername(res.username);
    });
  }, []);

  const handleChangeUsername = useMemo(
    () => (newUsername: string) => {
      console.log("newUsername", newUsername);
      request("/api/clients/user-name", {
        method: "POST",
        body: JSON.stringify({ username: newUsername }),
      }).then((res) => {
        console.log("res", res);
        // setUsername(res.username);
      });
    },
    [username]
  );
  return { username, handleChangeUsername, setUsername };
};
