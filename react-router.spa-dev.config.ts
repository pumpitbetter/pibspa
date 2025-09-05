import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode for mobile apps
  ssr: false,
  basename: "/",
  buildDirectory: "build/spa",
  // Use separate app directory for SPA
  appDirectory: "app-spa",
} satisfies Config;