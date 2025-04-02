"use client";
import { CodeClient } from "@/components/home/CodeClient";
import { FriendsCard } from "@/components/home/friends/FriendsCard";

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
