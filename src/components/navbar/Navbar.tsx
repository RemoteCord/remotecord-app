"use client";
import { Icon, Scroll } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ConfigMenu } from "../config/ConfigMenu";
import { TitleBar } from "./TitleBar";
import { IconHomeFilled, IconArticleFilled } from "@tabler/icons-react";

const items = [
  {
    title: "Home",
    url: "/",
    icon: IconHomeFilled,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: IconArticleFilled,
  },
];

export const NavBar: React.FC = () => {
  return (
    <div
      className=" h-fit py-2 w-full flex justify-between px-2 items-center"
      data-tauri-drag-region
    >
      <div className="flex gap-2">
        <Image src={"/icon.png"} width={30} height={30} alt="icon" />
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className="flex gap-2 hover:bg-zinc-900 bg-secondary transition-all duration-300 p-2 h-[30px] rounded-lg items-center justify-center aspect-square "
          >
            <item.icon size={20} />
            {item.title}
          </Link>
        ))}
        <ConfigMenu />
      </div>
      <div className="flex gap-4 items-center">
        <TitleBar />
        {/* <Image
          src={session?.user.user_metadata.picture}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
        /> */}
      </div>
    </div>
  );
};
