import { useApi } from "@/hooks/common/useApi";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useNavigate,
  useMatches,
  useParams,
  useLocation,
} from "react-router-dom";
import React, { useEffect } from "react";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Callback = () => {
  const router = useNavigate();
  const query = useQuery();

  const { request } = useApi();

  const { getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    // if (!location) return;
    const code = query.get("code");
    const state = query.get("state");
    console.log("params", code);
    if (!code || !state) return;

    getAccessTokenSilently()
      .then(async (token: string) => {
        console.log("token", token);
        const res = await request<{ status: boolean }>("/api/auth/callback", {
          method: "POST",
          body: JSON.stringify({
            token,
          }),
        });

        console.log("res", res);
        if (!res?.status) logout();

        router("/");
      })
      .catch(() => {
        console.log("error");
        logout();
      });

    // console.log("Callback", { code, state });
  }, []);

  return (
    <div>
      <p>aa</p>
    </div>
  );
};

export default Callback;
