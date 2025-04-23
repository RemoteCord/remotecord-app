import { authStore } from "@/services";
import type { UserData } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigator = useNavigate();

  const checkAuthentication = async () => {
    const user_data = await getUser();
    const token = await authStore.getRecord<string>("token");
    setToken(token);
    if (!user_data) {
      setIsAuthenticated(false);
      setUser(null);
      setError("No user data found");
    } else {
      setIsAuthenticated(true);
      setUser(user_data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void checkAuthentication();
  }, []);

  const getUser = async () => {
    const token = await authStore.getRecord<string>("token");

    if (!token) {
      console.log("no access token found");
      return;
    }

    const user_data = jwtDecode(token) as UserData;

    return user_data;
  };

  const signOut = async () => {
    await authStore.deleteRecord("token");
    await authStore.deleteRecord("user_data");
    setIsAuthenticated(false);
    setUser(null);
    // location.reload();

    navigator("/auth");
  };

  return {
    getUser,
    signOut,
    checkAuthentication,
    isAuthenticated,
    isLoading,
    user,
    token,
    error,
  };
};
