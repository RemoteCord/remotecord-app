import { IconArticleFilled, IconHomeFilled } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { ConfigMenu } from "../config/ConfigMenu";
import { TitleBar } from "./TitleBar";
import { PROTECTED_ROUTES } from "@/contexts/loggedProvider";

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
export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <div
      className=" h-fit py-2 w-full flex justify-between px-2 items-center"
      data-tauri-drag-region
    >
      {PROTECTED_ROUTES.includes(location.pathname) ? (
        <div className="flex gap-2">
          <img src={"/icon.png"} width={30} height={30} alt="icon" />
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="flex gap-2 hover:bg-zinc-900 bg-secondary transition-all duration-300 p-2 h-[30px] rounded-lg items-center justify-center aspect-square "
            >
              <item.icon size={20} />
              {item.title}
            </Link>
          ))}
          <ConfigMenu />
        </div>
      ) : (
        <img src={"/icon.png"} width={30} height={30} alt="icon" />
      )}
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
