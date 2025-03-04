import { SidebarProvider } from "@/components/ui/sidebar";
import SupabaseContextProvider from "./SupabaseContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SupabaseContextProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </SupabaseContextProvider>
  );
};
