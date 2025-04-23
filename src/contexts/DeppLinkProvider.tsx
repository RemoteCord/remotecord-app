import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";

export const DeepLinkProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigator = useNavigate();
  useEffect(() => {
    const listen = async () => {
      await onOpenUrl((urls) => {
        console.log("deep link:", urls);
        const url = urls[0];

        const path = url.split("://")[1];
        navigator(path);
        // window.location.href =
      });
    };
    void listen();
  }, []);
  return <>{children}</>;
};
