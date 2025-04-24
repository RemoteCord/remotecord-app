import { FriendsCard } from "@/features/friends/FriendsCard";
import { CodeClient } from "@/features/home/components/CodeClient";
import { Sounds } from "@/features/sounds/components/Sounds";

// import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={"overflow-hidden pt-8"}>
      <Sounds />
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video
        id="camera"
        width={window.innerWidth}
        height={window.innerHeight}
        className="hidden"
      />
      <CodeClient />
      <div className="w-[95%] mx-auto mt-10">
        <FriendsCard />
      </div>
      {/* <Link to="/auth">auth</Link> */}
    </div>
  );
};

export default Home;
