"use client";
import { NavBar } from "@/components/Navbar";
import { Providers } from "@/contexts/Providers";
import { useSupabaseContextProvider } from "@/contexts/SupabaseContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {} = useSupabaseContextProvider();

  return (
    <Providers>
      <NavBar />

      <div className="overflow-y-auto max-h-screen p-4">{children}</div>
    </Providers>
  );
}
