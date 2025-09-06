import type { Config } from "@react-router/dev/config";

export default {
  // SSR mode for web app with marketing + API
  ssr: true,
  basename: "/",
  buildDirectory: "build/ssr",
  serverBuildFile: "index.js",
  appDirectory: "app",
} satisfies Config;
