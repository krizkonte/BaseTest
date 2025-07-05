import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";
import { getBase } from "./config/environment";

export default defineConfig({
  base: getBase(),
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    visualizer({ open: true, filename: "build/bundle-report.html" }),
  ],
});
