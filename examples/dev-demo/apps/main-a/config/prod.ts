import type { BiuEnvironmentConfig } from "@biugle/biu-cli";

export default {
  environment: "prod",
  layout: {
    systemOptions: [
      { code: "main-a", label: "Portal A", url: "https://biu-a.biugle.cn" },
      { code: "main-b", label: "Portal B", url: "https://biu-b.biugle.cn" },
    ],
    activeSystem: "main-a",
  },
  remoteApps: {
    "child-app": { APP_URL: "https://biu-s.biugle.cn", ALLOWED_ORIGINS: ["https://biu-s.biugle.cn"] },
    "vue-child": { APP_URL: "https://biu-vue.biugle.cn", ALLOWED_ORIGINS: ["https://biu-vue.biugle.cn"] },
  },
  menu: { portalTreeUrl: "/api/menu/portal-tree", fallback: true },
} satisfies BiuEnvironmentConfig;
