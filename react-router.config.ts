import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode for mobile apps
  ssr: false,
  basename: "/",
  buildDirectory: "build/spa",
  // Standard app directory - routes will be copied during build
  appDirectory: "app",
} satisfies Config;