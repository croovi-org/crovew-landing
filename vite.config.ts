import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-simple-maps", "prop-types"],
  },
  build: {
    commonjsOptions: {
      include: [/react-simple-maps/, /prop-types/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
});
