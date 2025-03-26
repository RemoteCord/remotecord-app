"use client";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";
import { useDebouncedSync } from "./useDebounceSync";

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
    request("/api/clients/user-name", {
      method: "POST",
      body: JSON.stringify({ username: username }),
    }).then((res) => {
      console.log("res", res);
      // setUsername(res.username);
    });
  };

  useDebouncedSync(username, handleChangeUsername, 500);
  return { username, handleChangeUsername, setUsername };
};
