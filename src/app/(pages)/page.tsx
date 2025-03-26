"use client";
import { CodeClient } from "@/components/home/CodeClient";
import { FriendsCard } from "@/components/home/friends/FriendsCard";
import { TestComponents } from "@/components/TestComponents";
import { useFriends } from "@/hooks/useFriends";
import { useStoreTauri } from "@/hooks/useStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
export default function Home() {
  return (
    <div className="flex flex-col min-h-full ">
      <CodeClient />
      {/* <Link href="/auth">Auth</Link> */}
      <FriendsCard />
      {/* <TestComponents /> */}
    </div>
  );
}
