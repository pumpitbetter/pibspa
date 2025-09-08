import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths()
  ],
  build: {
    outDir: "build/spa"
  },
  server: {
    port: 5175
  },
  resolve: {
    alias: {
      // Prevent Prisma/database imports in SPA builds
      "~/lib/db/prisma": new URL("./app/lib/db/prisma.spa.ts", import.meta.url).pathname,
    }
  },
  define: {
    // Ensure we're in SPA mode
    "process.env.BUILD_MODE": JSON.stringify("spa"),
  }
});