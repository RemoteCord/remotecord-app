import KeyContextProvider from "./KeyContext";
import LogContextProvider from "./LogContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LogContextProvider>
      <KeyContextProvider>{children}</KeyContextProvider>
    </LogContextProvider>
  );
};
