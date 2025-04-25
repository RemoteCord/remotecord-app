import { useSession } from "@/hooks/authentication";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdate } from "@/hooks/common/useUpdate";

export const PROTECTED_ROUTES = ["/", "/logs"];

export const LoggedProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthentication } = useSession();
  const {
    loading: loadingUpdateRequest,
    currentVersion,
    latestVersion,
  } = useUpdate();
  const location = useLocation();
  const navigator = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (loadingUpdateRequest) return;

    // Only redirect to /update if currentVersion is less than latestVersion
    if (
      latestVersion &&
      currentVersion !== undefined &&
      currentVersion < latestVersion
    ) {
      if (path !== "/update") {
        console.log("update available", { currentVersion, latestVersion });
        navigator("/update", { replace: true });
      }
      return;
    }

    if (!PROTECTED_ROUTES.includes(path)) return;

    if (!isLoading && !isAuthenticated) {
      navigator("/auth", { replace: true });
    }
  }, [
    isLoading,
    isAuthenticated,
    loadingUpdateRequest,
    location.pathname,
    currentVersion,
    latestVersion,
    navigator,
  ]);

  return <>{children}</>;
};
