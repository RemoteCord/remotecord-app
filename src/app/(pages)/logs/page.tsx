"use client";
import { DataTable } from "@/components/logs/table/data-table";
import { columns, LogEvent } from "@/components/logs/table/table-columns";
import { useLogContextProvider } from "@/contexts/LogContext";

export default function LogsPage() {
  const { logs } = useLogContextProvider();

  return (
    <div className=" pr-4">
      <h1>Logs</h1>
      <DataTable columns={columns} data={logs} />
    </div>
  );
}
