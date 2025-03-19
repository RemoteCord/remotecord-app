import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import { TitleBarButton } from "./TitleBarButton";
import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

export const TitleBar: React.FC = () => {
  const [appWindow, setAppWindow] = useState<Window | null>(null);

  useEffect(() => {
    setAppWindow(getCurrentWindow());
  }, []);

  return (
    <div className="flex gap-2">
      <TitleBarButton toggle={() => appWindow?.minimize()}>
        <Minus size={16} strokeWidth={2} />
      </TitleBarButton>
      {/* <TitleBarButton toggle={() => appWindow.maximize()}>
        <Square size={12} strokeWidth={4} />
      </TitleBarButton> */}
      <TitleBarButton toggle={() => appWindow?.close()}>
        <X size={16} strokeWidth={2} />
      </TitleBarButton>
    </div>
  );
};
