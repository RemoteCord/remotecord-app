import { env } from "@/shared/env.config";
import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const { loginWithRedirect, logout } = useAuth0();

  const signOut = async () => {
    await logout({
      logoutParams: { returnTo: "http://localhost:3006/" },
      clientId: env.VITE_AUTH0_CLIENT_ID,
    });
  };

  return { signOut };
};
