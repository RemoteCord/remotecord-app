"use client";
import { useApi } from "@/hooks/common/useApi";
import { useDebouncedSync } from "@/hooks/common/useDebounceSync";
import { useEffect, useState } from "react";

export const useUserInfo = () => {
  const { request } = useApi();
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    request<{ username: string }>("/api/clients/user-info").then((res) => {
      console.log("res", res);
      if (res) setUsername(res.username);
    });
  }, []);

  const handleChangeUsername = () => {
    console.log("newUsername", username);
    request<{ status: boolean }>("/api/clients/user-name", {
      method: "POST",
      body: JSON.stringify({ username: username }),
    }).then((res) => {
      console.log("res", res);

      res?.status && setUsername(username);
    });
  };

  useDebouncedSync(username, handleChangeUsername, 500);
  return { username, handleChangeUsername, setUsername };
};
