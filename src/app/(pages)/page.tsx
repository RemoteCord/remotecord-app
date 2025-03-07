"use client";
import { TestComponents } from "@/components/TestComponents";
import { useStoreTauri } from "@/hooks/shared/useStore";
import Link from "next/link";
export default function Home() {
  const { cleanStore } = useStoreTauri();

  return (
    <div className="flex flex-col min-h-full ">
      <p>aaa</p>
      <button onClick={cleanStore}>Clean store</button>
      <Link href="/auth">Auth</Link>

      <TestComponents />
    </div>
  );
}
