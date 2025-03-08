"use client";
import { useSupabaseContextProvider } from "@/contexts/SupabaseContext";
import { useStoreTauri } from "@/hooks/shared/useStore";
import { Home, Scroll } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: Scroll,
  },
];

export const NavBar: React.FC = () => {
  const { session } = useSupabaseContextProvider();

  return (
    <div className="border border-b-white h-14 w-full flex justify-between py-2 px-12 items-center">
      <p>RemoteCord</p>
      <div className="flex gap-4 items-center">
        {items.map((item) => (
          <Link key={item.title} href={item.url} className="flex gap-2">
            <item.icon />
            {item.title}
          </Link>
        ))}
        <Image
          src={session?.user.user_metadata.picture}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
    </div>
  );
};
