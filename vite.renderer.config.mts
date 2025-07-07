import { defineConfig } from "vite";
// eslint-disable-next-line import/no-unresolved
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
