import { Providers } from "@/contexts/Providers";
import { LoggedProvider } from "@/contexts/loggedProvider";
import { ConnectionModalAnimation } from "@/features/modals/ConnectedModal/ConnectionModalAnimation";
import { WsClient } from "@/features/websocket/WsClient";
import Home from "@/routes/Home";
import { Logs } from "@/routes/Logs";
import Auth from "@/routes/auth/Auth";
import Callback from "@/routes/auth/Callback";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
// import Router, { Route, type RouterOnChangeArgs } from "preact-router";
import { Navbar } from "./common/navbar";
// import { useUpdater } from "@/hooks/common/useUpdater";

export function App() {
  // useUpdater();

  return (
    // <React.StrictMode>
    <>
      <LoggedProvider>
        <Providers>
          <WsClient>
            <main className="h-full w-full">
              <Navbar />
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/logs" element={<Logs />} />
                  {/* <Route path="/" component={Home} /> */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/callback" element={<Callback />} />
                </Routes>
              </Suspense>
            </main>
            <ConnectionModalAnimation />
          </WsClient>
        </Providers>
      </LoggedProvider>

      <Toaster />
    </>
    // </React.StrictMode>
  );
}
