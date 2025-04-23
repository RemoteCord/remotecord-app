import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/app.tsx";

const appElement = document.getElementById("app");
if (!appElement) throw new Error("Root element with id 'app' not found");
const root = createRoot(appElement);

console.log("PROD", import.meta.env.PROD);

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);
