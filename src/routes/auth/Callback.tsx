import { useSession } from "@/hooks/authentication";
import { authStore } from "@/services";
import { relaunch } from "@tauri-apps/plugin-process";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const NODE_ENV = import.meta.env.MODE;

const Callback = () => {
  const navigator = useNavigate();
  const query = useQuery();
  const { getUser } = useSession();

  useEffect(() => {
    // if (!location) return;

    async function getUserInfo(token: string) {
      await authStore.insertRecord("token", token as string);

      const user_data = await getUser();

      if (!user_data) {
        console.log("no user data found. token not valid");

        return;
      }

      await authStore.insertRecord("user_data", user_data);
      console.log("user data", user_data, NODE_ENV);
      if (NODE_ENV === "development") {
        navigator("/");
      } else {
        await relaunch();
      }
    }

    console.log("query", query);

    const token = query.get("token");

    if (!token) {
      console.log("no access token found");
      return;
    }

    console.log("params", token);
    void getUserInfo(token as string);
  }, [query]);

  return (
    <div>
      <p>aa</p>
    </div>
  );
};

export default Callback;
