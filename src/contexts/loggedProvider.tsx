import { useSession } from "@/hooks/authentication";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PROTECTED_ROUTES = ["/", "/logs"];

export const LoggedProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthentication } = useSession();
  const location = useLocation();
  const navigator = useNavigate();
  useEffect(() => {
    void checkAuthentication().then(() => {
      if (isLoading) return;

      console.log("location", { isLoading, location, isAuthenticated });
      const path = location.pathname;

      if (!PROTECTED_ROUTES.includes(path)) return;

      if (!isAuthenticated) navigator("/auth");
    });
  }, [location, isLoading]);
  return <>{children}</>;
};
