"use client";
import { CodeClient } from "@/components/home/CodeClient";
import { TestComponents } from "@/components/TestComponents";
import { useStoreTauri } from "@/hooks/useStore";
import Link from "next/link";
export default function Home() {
  const { cleanStore } = useStoreTauri();

  return (
    <div className="flex flex-col min-h-full ">
      <CodeClient />
      <button onClick={cleanStore} className="w-fit">
        Clean store
      </button>
      <Link href="/auth">Auth</Link>

      <TestComponents />
    </div>
  );
}
