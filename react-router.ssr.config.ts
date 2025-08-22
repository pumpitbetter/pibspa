import type { Config } from "@react-router/dev/config";

export default {
  // SSR mode for marketing site + API
  ssr: true,
  basename: "/",
  buildDirectory: "build/ssr",
  serverBuildFile: "index.js",
  // Include additional routes from routes-ssr directory
  appDirectory: "app",
} satisfies Config;