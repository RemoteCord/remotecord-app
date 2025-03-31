import WsContextProvider from "./WsContext";
import LogContextProvider from "./LogContext";
import KeyContextProvider from "./KeyContext";
import { WsApplicationProvider } from "./WsApplication";
import { DownloadingFile } from "./DownloadingFile";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LogContextProvider>
      <KeyContextProvider>
        <WsContextProvider>
          <WsApplicationProvider>
            <DownloadingFile />
            {children}
          </WsApplicationProvider>
        </WsContextProvider>
      </KeyContextProvider>
    </LogContextProvider>
  );
};
