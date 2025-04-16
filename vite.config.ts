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
  // Disable TypeScript errors for unused variables and module resolution during build
  esbuild: {
    legalComments: "none",
  },

  build: {
    target: "esnext",
    // disables type checking
    // comment out the next line if you want type checking
    // (not recommended for production)
    // check: false,
  },
});
