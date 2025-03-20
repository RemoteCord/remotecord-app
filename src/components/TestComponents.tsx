import AnimatedLightWebSocket from "./ui/AnimatedLightWebSocket";
import { Macros } from "./test-components/Macros";
import { Screenshot } from "./test-components/Screenshot";
import { SendNotificationButton } from "./test-components/sendNotification";
import { ShowDialog } from "./test-components/showDialog";
import { OsInfo } from "./test-components/osInfo";
import { Shell } from "./test-components/Shell";
import { TestRequest } from "./test-components/TestReq";
import { SendRequest } from "./test-components/sendRequest";

export const TestComponents = () => {
  return (
    <div className="h-full">
      <Macros />
      <Screenshot />
      <SendNotificationButton />
      <ShowDialog />
      <OsInfo />
      <Shell />
      <TestRequest />
      <SendRequest />
    </div>
  );
};
