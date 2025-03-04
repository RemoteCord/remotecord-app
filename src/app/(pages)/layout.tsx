"use client";
import { useSupabaseContextProvider } from "@/contexts/SupabaseContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {} = useSupabaseContextProvider();

  return <div>{children}</div>;
}
