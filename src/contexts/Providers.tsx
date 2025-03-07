import { SidebarProvider } from "@/components/ui/sidebar";
import SupabaseContextProvider from "./SupabaseContext";
import WsContextProvider from "./WsContext";
import WsApplicationContextProvider from "./WsApplicationContext";
import LogContextProvider from "./LogContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SupabaseContextProvider>
      <LogContextProvider>
        <WsContextProvider>
          <WsApplicationContextProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </WsApplicationContextProvider>
        </WsContextProvider>
      </LogContextProvider>
    </SupabaseContextProvider>
  );
};
