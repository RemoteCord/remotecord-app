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
import { DeepLinkProvider } from "@/contexts/DeppLinkProvider";
import Update from "@/routes/update/Update";

const GroupProtectedRoutes = () => {
  return (
    <div>
      <WsClient>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
        <ConnectionModalAnimation />
      </WsClient>
    </div>
  );
};

export function App() {
  // useUpdater();

  return (
    // <React.StrictMode>
    <>
      <DeepLinkProvider>
        <LoggedProvider>
          <Providers>
            <main className="h-full w-full relative">
              <Suspense fallback={<div>Loading...</div>}>
                {/* <GroupProtectedRoutes /> */}
                <Navbar />

                <Routes>
                  <Route path="/*" element={<GroupProtectedRoutes />} />

                  {/* <Route path="/" component={Home} /> */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/callback" element={<Callback />} />
                  <Route path="/update" element={<Update />} />
                </Routes>
              </Suspense>
            </main>
          </Providers>
        </LoggedProvider>

        <Toaster
          duration={3000}
          toastOptions={{
            className:
              "text-white rounded border-0 shadow-lg px-4 py-3 transition-all duration-300",
            style: {
              background: "#1a1b1e",
              color: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              border: "none",
            },
          }}
        />
      </DeepLinkProvider>
    </>
    // </React.StrictMode>
  );
}
