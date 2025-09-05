import type { Config } from "@react-router/dev/config";

export default {
  // SSR mode for marketing site + API
  ssr: true,
  basename: "/",
  buildDirectory: "build/ssr",
  serverBuildFile: "index.js",
  // Use separate app directory for SSR
  appDirectory: "app-ssr",
} satisfies Config;