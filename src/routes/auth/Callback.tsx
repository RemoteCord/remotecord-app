import { useSession } from "@/hooks/authentication";
import { useApi } from "@/hooks/common/useApi";
import { authStore } from "@/services";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Callback = () => {
  const router = useNavigate();
  const query = useQuery();
  const { getUser } = useSession();
  const { request } = useApi();

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
      console.log("user data", user_data);
      router("/");
    }

    const token = query.get("token");

    if (!token) {
      console.log("no access token found");
      return;
    }

    console.log("params", token);
    void getUserInfo(token as string);
  }, []);

  return (
    <div>
      <p>aa</p>
    </div>
  );
};

export default Callback;
