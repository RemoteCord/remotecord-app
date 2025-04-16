import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tauri from "vite-plugin-tauri";

import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),

    //tauri()
  ],
  clearScreen: false,
  server: {
    open: false,

  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
