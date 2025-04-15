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

export function App() {
	// const handleRoute = async (
	//   e: RouterOnChangeArgs<Record<string, string | undefined> | null>
	// ) => {
	//   console.log("ROUTE", e);
	//   const path = e.path;
	//   if (!path) return;
	//   if (!PROTECTED_ROUTES.includes(path)) return;
	//   console.log("isAuthenticated", isAuthenticated);
	//   if (!isAuthenticated) {
	//     route("/auth", true);
	//     return;
	//   }
	//   // route("/auth", true);
	// };

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
