"use client";
import { NavBar } from "@/components/navbar/Navbar";
import { Providers } from "@/contexts/Providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <NavBar />

      <div className="overflow-y-auto max-h-screen p-4">{children}</div>
    </Providers>
  );
}
