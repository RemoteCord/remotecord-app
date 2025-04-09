import { cn } from "@/lib/utils";

export const ConfigCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        " border border-zinc-900 px-2 py-2 rounded-lg bg-zinc-900",
        className
      )}
    >
      {children}
    </div>
  );
};
