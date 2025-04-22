import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/app.tsx";
import { env } from "./shared/env.config.ts";

const CLIENT_ID = env.VITE_AUTH0_CLIENT_ID;
const CLIENT_DOMAIN = env.VITE_AUTH0_DOMAIN;

const appElement = document.getElementById("app");
if (!appElement) throw new Error("Root element with id 'app' not found");
const root = createRoot(appElement);

console.log("PROD", import.meta.env.PROD);

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Auth0Provider
      domain={CLIENT_DOMAIN}
      clientId={CLIENT_ID}
      authorizationParams={{
        redirect_uri: import.meta.env.PROD
          ? "http://tauri.localhost/callback"
          : "http://localhost:3006/callback",
        scope: "openid profile email",
        audience: env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
