import { Button } from "@/components/ui/Button";
import { FriendsCard } from "@/features/friends/FriendsCard";
import { CodeClient } from "@/features/home/components/CodeClient";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={"overflow-hidden pt-8"}>
      <CodeClient />
      <div className="w-[95%] mx-auto mt-10">
        <FriendsCard />
      </div>
      {/* <Link to="/auth">auth</Link>

      <Button variant="default">Default</Button> */}
    </div>
  );
};

export default Home;
