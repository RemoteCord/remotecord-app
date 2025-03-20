"use client";
import { NavBar } from "@/components/navbar/Navbar";
import { ConnectionModalAnimation } from "@/components/page/ConnectionModal/ConnectionModalAnimation";
import { Providers } from "@/contexts/Providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <NavBar />
      <ConnectionModalAnimation />
      <div className="overflow-y-auto max-h-screen p-4">{children}</div>
    </Providers>
  );
}
