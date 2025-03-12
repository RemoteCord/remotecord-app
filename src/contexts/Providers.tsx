import SupabaseContextProvider from "./SupabaseContext";
import WsContextProvider from "./WsContext";
import LogContextProvider from "./LogContext";
import KeyContextProvider from "./KeyContext";
import { WsApplication } from "./WsApplication";
import { DownloadingFile } from "./DownloadingFile";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LogContextProvider>
      <WsContextProvider>
        <WsApplication />
        <DownloadingFile />
        <KeyContextProvider>{children}</KeyContextProvider>
      </WsContextProvider>
    </LogContextProvider>
  );
};
