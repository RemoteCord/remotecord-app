import SupabaseContextProvider from "./SupabaseContext";
import WsContextProvider from "./WsContext";
import LogContextProvider from "./LogContext";
import KeyContextProvider from "./KeyContext";
import { WsApplicationProvider } from "./WsApplication";
import { DownloadingFile } from "./DownloadingFile";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LogContextProvider>
      <WsContextProvider>
        <WsApplicationProvider>
          <DownloadingFile />
          <KeyContextProvider>{children}</KeyContextProvider>
        </WsApplicationProvider>
      </WsContextProvider>
    </LogContextProvider>
  );
};
