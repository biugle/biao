import type { BiuEnvironmentConfig } from "@biugle/biu-cli";

export default {
  environment: "test",
  layout: {
    systemOptions: [
      { code: "main-a", label: "Portal A", url: "https://portal-a.test.example.com" },
      { code: "main-b", label: "Portal B", url: "https://portal-b.test.example.com" },
    ],
    activeSystem: "main-a",
  },
  remoteApps: {
    "child-app": {
      APP_URL: "https://child-app.test.example.com",
      ALLOWED_ORIGINS: ["https://child-app.test.example.com"],
    },
    "vue-child": {
      APP_URL: "https://vue-child.test.example.com",
      ALLOWED_ORIGINS: ["https://vue-child.test.example.com"],
    },
  },
  menu: { portalTreeUrl: "/api/menu/portal-tree", fallback: true },
} satisfies BiuEnvironmentConfig;
