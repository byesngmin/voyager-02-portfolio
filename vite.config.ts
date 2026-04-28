import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const base = isGitHubPages ? process.env.BASE_PATH ?? "/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
});

