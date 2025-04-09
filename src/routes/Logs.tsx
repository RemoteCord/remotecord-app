import { useLogContextProvider } from "@/contexts/LogContext";
import { DataTable } from "@/features/logs/components/table/data-table";
import { columns } from "@/features/logs/components/table/table-columns";

export const Logs: React.FC = () => {
  const { logs } = useLogContextProvider();

  return (
    <div className="p-4">
      <DataTable columns={columns} data={logs} />
    </div>
  );
};
