import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode for mobile apps
  ssr: false,
  basename: "/",
  buildDirectory: "build/spa",
  // Use app directory (symlinked to ../app-spa)
  appDirectory: "app",
} satisfies Config;