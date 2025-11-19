import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "quiz.steamkarnival.com",
      "steamkarnival.com",
      "devquiz.steamkarnival.com",
    ],
  },
});
