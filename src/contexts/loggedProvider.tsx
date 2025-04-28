import { useSession } from "@/hooks/authentication";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdate } from "@/hooks/common/useUpdate";
import { useFolderPicker } from "@/components/common/config/hooks/useFolderPicker";

export const PROTECTED_ROUTES = ["/", "/logs"];

export const LoggedProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthentication } = useSession();
  const [firstLoad, setFirstLoad] = useState(true);
  const { folderPath, loading: LoadingFolder } = useFolderPicker();
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
    if (LoadingFolder) return;

    if (firstLoad) {
      console.log("firstLoad", { folderPath });
      if (!folderPath) {
        navigator("/config");
        setFirstLoad(false);
      }
    }

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
    LoadingFolder,
    navigator,
  ]);

  return <>{children}</>;
};
