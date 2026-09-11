import type { BiuEnvironmentConfig } from "@biugle/biu-cli";

export default {
  environment: "dev",
  layout: {
    systemOptions: [
      { code: "main-a", label: "Portal A", url: "https://portal-a.dev.example.com" },
      { code: "main-b", label: "Portal B", url: "https://portal-b.dev.example.com" },
    ],
    activeSystem: "main-b",
  },
  remoteApps: {
    "child-app": {
      APP_URL: "https://child-app.dev.example.com",
      ALLOWED_ORIGINS: ["https://child-app.dev.example.com"],
    },
  },
  menu: { portalTreeUrl: "/api/menu/portal-tree", fallback: true },
} satisfies BiuEnvironmentConfig;
