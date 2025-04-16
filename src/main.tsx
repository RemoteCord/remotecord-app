import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/app.tsx";
import { env } from "./shared/env.config.ts";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const CLIENT_ID = env.VITE_AUTH0_CLIENT_ID;
const CLIENT_DOMAIN = env.VITE_AUTH0_DOMAIN;

const appElement = document.getElementById("app");
if (!appElement) throw new Error("Root element with id 'app' not found");
const root = createRoot(appElement);

const update = await check();

console.log("update", update);

if (update) {
  console.log(
    `found update ${update.version} from ${update.date} with notes ${update.body}`
  );
  let downloaded = 0;
  let contentLength = 0;
  // alternatively we could also call update.download() and update.install() separately
  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case "Started":
        contentLength = event.data.contentLength ?? 0;
        console.log(
          `started downloading ${event.data.contentLength ?? 0} bytes`
        );
        break;
      case "Progress":
        downloaded += event.data.chunkLength;
        console.log(`downloaded ${downloaded} from ${contentLength}`);
        break;
      case "Finished":
        console.log("download finished");
        break;
    }
  });

  console.log("update installed");
  await relaunch();
}

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Auth0Provider
      domain={CLIENT_DOMAIN}
      clientId={CLIENT_ID}
      authorizationParams={{
        redirect_uri: "http://localhost:3006/callback",
        scope: "openid profile email",
        audience: env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
