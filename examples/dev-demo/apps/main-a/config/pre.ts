import type { BiuEnvironmentConfig } from "@biugle/biu-cli";

export default {
  environment: "pre",
  layout: {
    systemOptions: [
      { code: "main-a", label: "Portal A", url: "https://portal-a.pre.example.com" },
      { code: "main-b", label: "Portal B", url: "https://portal-b.pre.example.com" },
    ],
    activeSystem: "main-a",
  },
  remoteApps: {
    "child-app": {
      APP_URL: "https://child-app.pre.example.com",
      ALLOWED_ORIGINS: ["https://child-app.pre.example.com"],
    },
    "vue-child": {
      APP_URL: "https://vue-child.pre.example.com",
      ALLOWED_ORIGINS: ["https://vue-child.pre.example.com"],
    },
  },
  menu: { portalTreeUrl: "/api/menu/portal-tree", fallback: true },
} satisfies BiuEnvironmentConfig;
