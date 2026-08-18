import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // You may need to run: npm install -D @types/node

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
