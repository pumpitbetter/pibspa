import type { Config } from "@react-router/dev/config";

// Dynamic config based on environment variable
const isSpa = process.env.REACT_ROUTER_DEV_MODE === 'spa';

export default {
  ssr: !isSpa,
  basename: "/",
  buildDirectory: isSpa ? "build/spa" : "build/ssr", 
  serverBuildFile: isSpa ? undefined : "index.js",
  appDirectory: "app",
} satisfies Config;