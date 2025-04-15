import { Button } from "@/components/ui/Button";
import { FriendsCard } from "@/features/friends/FriendsCard";
import { CodeClient } from "@/features/home/components/CodeClient";
import { useWebcams } from "@/features/webcam/hooks/useWebcams";

import { Link } from "react-router-dom";

const Home = () => {
  const { listWebcams, takeScreenshotWebcam } = useWebcams();

  return (
    <div className={"overflow-hidden pt-8"}>
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
      <Link to="/auth">auth</Link>

      <Button variant="default">Default</Button>

      <button type="button" onClick={listWebcams}>
        webcams
      </button>
      <button type="button" onClick={() => takeScreenshotWebcam(0)}>
        webcam screenshot
      </button>
    </div>
  );
};

export default Home;
