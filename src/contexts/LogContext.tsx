"use client";

import { createContext, useContext, useState } from "react";

import { LogEvent } from "@/components/logs/table/table-columns";

const LogContext = createContext<
  | {
      logs: LogEvent[] | [];
      appendLog: (log: Omit<LogEvent, "id" | "timestamp">) => void;
    }
  | undefined
>(undefined);

const LogContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [logs, setLogs] = useState<LogEvent[] | []>([]);

  const appendLog = (log: Omit<LogEvent, "id" | "timestamp">) => {
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const currentTimestamp = new Date().toLocaleString("es", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const logReturn = {
      id: uniqueId,
      timestamp: currentTimestamp,
      ...log,
    };

    setLogs((prevLogs) => (prevLogs ? [logReturn, ...prevLogs] : [logReturn]));
  };

  return (
    <LogContext.Provider value={{ logs, appendLog }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogContextProvider = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("aaa must be used within a bbb");
  }

  return context;
};

export default LogContextProvider;
